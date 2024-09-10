package encryption

import (
	database "GoPass/backend/db"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"log"

	"go.etcd.io/bbolt"
)

func RevealPassword(db *bbolt.DB, account, userKey, id string) (string, error) {

	var password models.Password

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(database.BucketPassword))
		if userBucket == nil {
			log.Println("bucket not found")
			return eh.ErrInternalServer
		}

		keyName := fmt.Sprintf("%s:%s", account, id)

		password_byte := userBucket.Get([]byte(keyName))
		if password_byte == nil {
			return eh.ErrNotFound
		}

		err := json.Unmarshal(password_byte, &password)
		if err != nil {
			log.Println("Unmarshal error")
			return eh.ErrInternalServer
		}
		return nil
	})
	if err != nil {
		return "", err
	}

	decrypted, err := DecryptPassword(password.Pwd, userKey)
	if err != nil {
		log.Printf("Decryption failure: %v", err)
		return "", eh.ErrInternalServer
	}

	return decrypted, nil
}
