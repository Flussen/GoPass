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

func SavePassword(db *bbolt.DB, user, usernameToSave, service, password, userKey, creationDate string) (string, error) {

	encryptedPassword, err := encryption.EncryptPassword(password, userKey)
	if err != nil {
		return "", err
	}

	id := uuid.New().String()

	newPasswordData := models.Password{
		Title:       service,
		Id:          id,
		Pwd:         encryptedPassword,
		Username:    usernameToSave,
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
		return fmt.Errorf("user and id must not be empty")
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
		return fmt.Errorf("none of the parameters can be empty")
	}

	encryptedPassword, err := encryption.EncryptPassword(newPwd, userKey)
	if err != nil {
		return err
	}

	newPasswordData := models.Password{
		Title:       newTitle,
		Id:          id,
		Pwd:         encryptedPassword,
		Username:    newUsername,
		CreatedDate: newDate,
	}

	dataBytes, err := json.Marshal(newPasswordData)
	if err != nil {
		return err
	}

	err = db.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(user))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", user)
		}
		return userBucket.Put([]byte(id), dataBytes)
	})
	if err != nil {
		return err
	}
	return nil
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
