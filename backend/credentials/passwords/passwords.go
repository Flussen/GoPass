package passwords

import (
	"GoPass/backend/controllers"
	database "GoPass/backend/db"
	"GoPass/backend/encryption"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func NewPassword(db *bbolt.DB, account, userKey string, rqst request.Password) (string, error) {

	if account == "" || rqst == (request.Password{}) {
		return "", eh.ErrEmptyParameter
	}

	if rqst.Settings.Group == "" {
		rqst.Settings.Group = "none"
	}

	if rqst.Settings.Icon == "" {
		rqst.Settings.Icon = "default"
	}

	if rqst.Settings.Status == "" {
		rqst.Settings.Status = "default"
	}

	encryptedPassword, err := encryption.EncryptPassword(rqst.Pwd, userKey)
	if err != nil {
		return "", err
	}

	newPassword := models.Password{
		ID:       uuid.New().String(),
		Title:    rqst.Title,
		Username: rqst.Username,
		Pwd:      encryptedPassword,
		Settings: models.Settings{
			Favorite: rqst.Settings.Favorite,
			Group:    rqst.Settings.Group,
			Icon:     rqst.Settings.Icon,
			Status:   rqst.Settings.Status,
		},
		CreatedAt: time.Now(),
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
			return eh.ErrInternalServer
		}

		err := bucket.Delete([]byte(keyName))
		if err != nil {
			log.Println("ERROR:", err)
			return eh.ErrInternalServer
		}

		if bucket.Get([]byte(keyName)) != nil {
			return eh.ErrNotFound
		}

		return nil
	})
}

func UpdatePassword(db *bbolt.DB, account, id, userKey string, rqst request.Password) error {
	if account == "" || id == "" || userKey == "" || rqst == (request.Password{}) {
		return eh.ErrEmptyParameter
	}

	data, err := controllers.GetUserInfo(db, account)
	if err != nil {
		return err
	}
	if data.UserKey == userKey {
		encryptedPassword, err := encryption.EncryptPassword(rqst.Pwd, userKey)
		if err != nil {
			return err
		}

		keyName := fmt.Sprintf("%s:%s", account, id)

		err = db.Update(func(tx *bbolt.Tx) error {

			userBucket := tx.Bucket([]byte(database.BucketPassword))
			if userBucket == nil {
				return eh.ErrInternalServer
			}

			dataByte := userBucket.Get([]byte(keyName))

			var oldPass models.Password

			err := json.Unmarshal(dataByte, &oldPass)
			if err != nil {
				return err
			}

			newPasswordData := models.Password{
				Title:     rqst.Title,
				ID:        id,
				Pwd:       encryptedPassword,
				Username:  rqst.Username,
				CreatedAt: time.Now(),
				Settings:  oldPass.Settings,
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
			return eh.ErrInternalServer
		}

		passwordBytes := userBucket.Get([]byte(keyName))
		if passwordBytes == nil {
			return eh.ErrNotFound
		}

		json.Unmarshal(passwordBytes, &password)

		return nil
	})
	if err != nil {
		return models.Password{}, err
	}

	if password.ID == "" {
		return models.Password{}, eh.ErrInternalServer
	}

	return password, nil
}

func SetPasswordSettings(db *bbolt.DB, account, id string, settings models.Settings) error {
	if id == "" || account == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	var oldPassword models.Password

	keyName := fmt.Sprintf("%s:%s", account, id)

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			return eh.ErrInternalServer
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

	if settings.Group == "" {
		settings.Group = oldPassword.Settings.Group
	}
	if settings.Icon == "" {
		settings.Icon = oldPassword.Settings.Icon
	}
	if settings.Status == "" {
		settings.Status = oldPassword.Settings.Status
	}

	newModel := models.Password{
		ID:        oldPassword.ID,
		Title:     oldPassword.Title,
		Username:  oldPassword.Username,
		Pwd:       oldPassword.Pwd,
		Settings:  settings,
		CreatedAt: oldPassword.CreatedAt,
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			return eh.ErrInternalServer
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
	var wg sync.WaitGroup
	passwordChan := make(chan models.Password)
	errorChan := make(chan error)

	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketPassword))
		if bucket == nil {
			log.Println("ERROR: bucket not exist")
			return eh.ErrInternalServer
		}

		c := bucket.Cursor()
		prefix := []byte(fmt.Sprintf("%s:", account))

		for k, v := c.Seek(prefix); k != nil && strings.HasPrefix(string(k),
			string(prefix)); k, v = c.Next() {

			wg.Add(1)
			go func(val []byte) {
				defer wg.Done()

				var password models.Password
				err := json.Unmarshal(val, &password)
				if err != nil {
					log.Println("ERROR:", err)
					errorChan <- err
				} else {
					passwordChan <- password
				}
			}(v)
		}
		return nil
	})
	if err != nil {
		log.Println("ERROR:", err)
		return nil, err
	}

	go func() {
		wg.Wait()
		close(passwordChan)
		close(errorChan)
	}()

	for password := range passwordChan {
		passwords = append(passwords, password)
	}

	var firstError error
	for err := range errorChan {
		if firstError == nil {
			firstError = err
		}
		log.Println("ERROR:", err)
	}

	if firstError != nil {
		return nil, eh.ErrInternalServer
	}

	if len(passwords) == 0 {
		return nil, eh.ErrNotFound
	}

	return passwords, err
}
