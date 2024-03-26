package controllers

import (
	"GoPass/backend/encryption"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func SavePassword(db *bbolt.DB, user, userKey, usernameToSave, title, password, creationDate string, data models.Data) (string, error) {

	if user == "" || userKey == "" || usernameToSave == "" ||
		title == "" || password == "" || data.Icon == "" ||
		data.Status == "" || data.Group == "" {
		return "", eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	encryptedPassword, err := encryption.EncryptPassword(password, userKey)
	if err != nil {
		return "", err
	}

	id := uuid.New().String()

	newPasswordData := models.Password{
		Id:       id,
		Title:    title,
		Username: usernameToSave,
		Pwd:      encryptedPassword,
		Data: models.Data{
			Favorite: data.Favorite,
			Group:    data.Group,
			Icon:     data.Icon,
			Status:   data.Status,
		},
		CreatedDate: creationDate,
	}

	dataBytes, err := json.Marshal(newPasswordData)
	if err != nil {
		return "", err
	}
	err = db.Update(func(tx *bbolt.Tx) error {
		passwordBucket, err := tx.CreateBucketIfNotExists([]byte(user))
		if err != nil {
			return err
		}
		return passwordBucket.Put([]byte(id), dataBytes)
	})
	if err != nil {
		return "", err
	}
	return id, nil
}

func DeletePass(DB *bbolt.DB, user, id string) error {
	if user == "" || id == "" {
		return fmt.Errorf(eh.ErrEmptyParameters)
	}
	return DB.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(user))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", user)
		}

		err := userBucket.Delete([]byte(id))
		if err != nil {
			return fmt.Errorf("failed to delete password for id %s: %v", id, err)
		}

		if userBucket.Get([]byte(id)) != nil {
			return fmt.Errorf("password for id %s was not deleted", id)
		}

		return nil
	})
}

func UpdatePass(db *bbolt.DB, user, id, userKey, newTitle, newPwd, newUsername, newDate string) error {
	if user == "" || id == "" || userKey == "" ||
		newTitle == "" || newPwd == "" ||
		newUsername == "" || newDate == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	data, err := GetUserInfo(db, user)
	if err != nil {
		return err
	}
	if data.UserKey == userKey {
		encryptedPassword, err := encryption.EncryptPassword(newPwd, userKey)
		if err != nil {
			return err
		}

		err = db.Update(func(tx *bbolt.Tx) error {

			userBucket := tx.Bucket([]byte(user))
			if userBucket == nil {
				return fmt.Errorf("bucket not found for user %s", user)
			}

			dataByte := userBucket.Get([]byte(id))

			var oldPass models.Password

			err := json.Unmarshal(dataByte, &oldPass)
			if err != nil {
				return err
			}

			newPasswordData := models.Password{
				Title:       newTitle,
				Id:          id,
				Pwd:         encryptedPassword,
				Username:    newUsername,
				CreatedDate: newDate,
				Data:        oldPass.Data,
			}

			dataBytes, err := json.Marshal(newPasswordData)
			if err != nil {
				return err
			}

			return userBucket.Put([]byte(id), dataBytes)
		})
		if err != nil {
			return err
		}
		return nil
	}
	return eh.NewGoPassError(eh.ErrInvalidUserKey)
}

func UserPasswordByID(db *bbolt.DB, username, id string) ([]byte, error) {
	var pwdByte []byte
	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		encryptedPasswordBytes := userBucket.Get([]byte(id))
		if encryptedPasswordBytes == nil {
			return eh.NewGoPassErrorf("password not found for %s\nUser: %s", id, username)
		}
		pwdByte = encryptedPasswordBytes
		return nil
	})
	if err != nil {
		return nil, err
	}
	return pwdByte, nil
}

func SetPasswordConfig(db *bbolt.DB, id, user string, data models.Data) error {
	if id == "" || user == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	var oldPassword models.Password

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(user))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", user)
		}

		passwordByte := userBucket.Get([]byte(id))
		if passwordByte == nil {
			return eh.NewGoPassErrorf("password not found for %s\nUser: %s", id, user)
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
		Id:          oldPassword.Id,
		Title:       oldPassword.Title,
		Username:    oldPassword.Username,
		Pwd:         oldPassword.Pwd,
		Data:        data,
		CreatedDate: oldPassword.CreatedDate,
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(user))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", user)
		}

		bytes, err := json.Marshal(newModel)
		if err != nil {
			return err
		}
		return userBucket.Put([]byte(id), bytes)
	})
}
