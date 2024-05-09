package auth

import (
	"GoPass/backend/models"
	"encoding/json"

	"go.etcd.io/bbolt"
)

func CheckUserExists(db *bbolt.DB, username, email string) (exists bool, err error) {
	err = db.View(func(tx *bbolt.Tx) error {
		usersBucket := tx.Bucket([]byte("Users"))
		if usersBucket == nil {
			return nil // Consider an empty bucket as non-existent
		}

		// Search by username
		userBytes := usersBucket.Get([]byte(username))
		if userBytes != nil {
			exists = true
			return nil
		}

		// Optional: Search by email, requires iterating if emails are not keys
		c := usersBucket.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var user models.User
			if err := json.Unmarshal(v, &user); err != nil {
				continue // or handle the error
			}
			if user.Email == email {
				exists = true
				return nil
			}
		}

		return nil
	})

	return
}

func CreateUser(db *bbolt.DB, user models.User) error {
	// Serialize the user to JSON
	userBytes, err := json.Marshal(user)
	if err != nil {
		return err
	}

	// Insert/update the user in the database
	return db.Update(func(tx *bbolt.Tx) error {
		// Ensure the bucket exists
		b, err := tx.CreateBucketIfNotExists([]byte("Users"))
		if err != nil {
			return err
		}

		// Use the user's username as the key to store the serialized value
		return b.Put([]byte(user.Account), userBytes)
	})
}
