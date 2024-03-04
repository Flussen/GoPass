package controllers

import (
	"GoPass/backend/encryption"
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

func DeletePass(DB *bbolt.DB, userID, service string) error {
	return DB.Update(func(tx *bbolt.Tx) error {
		// Get the user's password bucket
		userBucket := tx.Bucket([]byte(userID))
		if userBucket == nil {
			return fmt.Errorf("bucket not found for user %s", userID)
		}

		// Delete the password associated with the service
		err := userBucket.Delete([]byte(service))
		if err != nil {
			return fmt.Errorf("failed to delete password for service %s: %v", service, err)
		}

		return nil
	})
}
