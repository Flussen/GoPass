package passwords

import (
	"GoPass/backend/controllers"
	database "GoPass/backend/db"
	"GoPass/backend/encryption"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func SavePassword(db *bbolt.DB, account, userKey, username, title, password, creationDate string, settings models.Settings) (string, error) {

	if account == "" || userKey == "" || username == "" ||
		title == "" || password == "" {
		return "", eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	if settings.Group == "" {
		settings.Group = "none"
	}

	if settings.Icon == "" {
		settings.Icon = "default"
	}

	if settings.Status == "" {
		settings.Status = "default"
	}

	encryptedPassword, err := encryption.EncryptPassword(password, userKey)
	if err != nil {
		return "", err
	}

	newPassword := models.Password{
		ID:       uuid.New().String(),
		Title:    title,
		Username: username,
		Pwd:      encryptedPassword,
		Data: models.Settings{
			Favorite: settings.Favorite,
			Group:    settings.Group,
			Icon:     settings.Icon,
			Status:   settings.Status,
		},
		CreatedDate: creationDate,
	}

	passwordByte, err := json.Marshal(newPassword)
	if err != nil {
		return "", err
	}

	keyName := fmt.Sprintf("%s:%s", account, newPassword.ID)

	err = db.Update(func(tx *bbolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte(database.BucketPassword))
		if err != nil {
			return err
		}

		return bucket.Put([]byte(keyName), passwordByte)
	})
	if err != nil {
		return "", err
	}
	return newPassword.ID, nil
}

func DeletePassword(DB *bbolt.DB, account, id string) error {
	if account == "" || id == "" {
		return fmt.Errorf(eh.ErrEmptyParameters)
	}

	keyName := fmt.Sprintf("%s:%s", account, id)

	return DB.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketPassword))
		if bucket == nil {
			eh.NewGoPassError(eh.ErrInternalServer)
		}

		err := bucket.Delete([]byte(keyName))
		if err != nil {
			log.Println("ERROR:", err)
			return eh.NewGoPassError("id not found or cannot deleted")
		}

		if bucket.Get([]byte(keyName)) != nil {
			return eh.NewGoPassErrorf("password for id %s was not deleted", id)
		}

		return nil
	})
}

func UpdatePassword(db *bbolt.DB, account, id, userKey, newTitle, newPwd, newUsername, newDate string) error {
	if account == "" || id == "" || userKey == "" ||
		newTitle == "" || newPwd == "" ||
		newUsername == "" || newDate == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	data, err := controllers.GetUserInfo(db, account)
	if err != nil {
		return err
	}
	if data.UserKey == userKey {
		encryptedPassword, err := encryption.EncryptPassword(newPwd, userKey)
		if err != nil {
			return err
		}

		keyName := fmt.Sprintf("%s:%s", account, id)

		err = db.Update(func(tx *bbolt.Tx) error {

			userBucket := tx.Bucket([]byte(database.BucketPassword))
			if userBucket == nil {
				eh.NewGoPassError(eh.ErrInternalServer)
			}

			dataByte := userBucket.Get([]byte(keyName))

			var oldPass models.Password

			err := json.Unmarshal(dataByte, &oldPass)
			if err != nil {
				return err
			}

			newPasswordData := models.Password{
				Title:       newTitle,
				ID:          id,
				Pwd:         encryptedPassword,
				Username:    newUsername,
				CreatedDate: newDate,
				Data:        oldPass.Data,
			}

			dataBytes, err := json.Marshal(newPasswordData)
			if err != nil {
				return err
			}

			return userBucket.Put([]byte(keyName), dataBytes)
		})
		if err != nil {
			return err
		}
		return nil
	}
	return eh.NewGoPassError(eh.ErrInvalidUserKey)
}

func GetPasswordByID(db *bbolt.DB, account, id string) (models.Password, error) {
	var password models.Password

	keyName := fmt.Sprintf("%s:%s", account, id)

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		passwordBytes := userBucket.Get([]byte(keyName))
		if passwordBytes == nil {
			return eh.NewGoPassErrorf("password not found for %s\nUser: %s", id, account)
		}

		json.Unmarshal(passwordBytes, &password)

		return nil
	})
	if err != nil {
		return models.Password{}, err
	}

	if password.ID == "" {
		return models.Password{}, eh.NewGoPassError(eh.ErrInternalServer)
	}

	return password, nil
}

func SetPasswordSettings(db *bbolt.DB, account, id string, data models.Settings) error {
	if id == "" || account == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	var oldPassword models.Password

	keyName := fmt.Sprintf("%s:%s", account, id)

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrInternalServer)
		}

		passwordByte := userBucket.Get([]byte(keyName))
		if passwordByte == nil {
			return eh.NewGoPassErrorf("password not found for id: %s", id)
		}

		err := json.Unmarshal(passwordByte, &oldPassword)
		if err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		return nil
	})

	if err != nil {
		return err
	}

	if data.Group == "" {
		data.Group = oldPassword.Data.Group
	}
	if data.Icon == "" {
		data.Icon = oldPassword.Data.Icon
	}
	if data.Status == "" {
		data.Status = oldPassword.Data.Status
	}

	newModel := models.Password{
		ID:          oldPassword.ID,
		Title:       oldPassword.Title,
		Username:    oldPassword.Username,
		Pwd:         oldPassword.Pwd,
		Data:        data,
		CreatedDate: oldPassword.CreatedDate,
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrInternalServer)
		}

		bytes, err := json.Marshal(newModel)
		if err != nil {
			return err
		}
		return userBucket.Put([]byte(keyName), bytes)
	})
}

func GetAllPasswords(db *bbolt.DB, account string) ([]models.Password, error) {
	var passwords []models.Password

	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketPassword))
		if bucket == nil {
			return eh.NewGoPassError(eh.ErrInternalServer)
		}

		c := bucket.Cursor()
		prefix := []byte(fmt.Sprintf("%s:", account))

		for k, v := c.Seek(prefix); k != nil && strings.HasPrefix(string(k),
			string(prefix)); k, v = c.Next() {

			var pass models.Password

			err := json.Unmarshal(v, &pass)
			if err != nil {
				log.Println("ERROR:", err)
				return eh.NewGoPassError(eh.ErrInternalServer)
			}

			fmt.Println(k, v)
			passwords = append(passwords, pass)
		}
		return nil
	})
	if err != nil {
		log.Println("ERROR:", err)
		return []models.Password{}, err
	}

	return passwords, err
}
