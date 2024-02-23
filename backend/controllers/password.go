package controllers

import (
	"GoPass/backend/encryption"
	"fmt"
	"log"

	"go.etcd.io/bbolt"
)

func SavePassword(db *bbolt.DB, userID, service, password, userKey string) error {

	encryptedPassword, err := encryption.EncryptPassword(password, userKey)
	if err != nil {
		log.Println("Encription failure", err)
		return err
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket, err := tx.CreateBucketIfNotExists([]byte(userID))
		if err != nil {
			return err
		}

		return userBucket.Put([]byte(service), []byte(encryptedPassword))
	})
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
