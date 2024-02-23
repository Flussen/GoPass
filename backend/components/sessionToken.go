package components

import (
	"GoPass/backend/models"
	"encoding/json"
	"errors"
	"log"
	"time"

	"go.etcd.io/bbolt"
)

// Verify that the session is satisfactory.
// First check the database if the bucket exists, if it does not exist it gives an error,
// creates a cursor, receives the data and parses it. then check if the expiration time is still valid
// if all checks were successful, it will return true, else return false with de error
func VerifySessionToken(DB *bbolt.DB, token string) (bool, error) {

	var (
		userFound bool
		isValid   bool
	)

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {

			var user models.User
			if err := json.Unmarshal(v, &user); err != nil {
				return errors.New("error parsing user")
			}
			expiryTime, err := time.Parse(time.RFC3339, user.TokenExpiry)
			if err != nil {
				log.Printf("Error parsing expiry time: %v", err)
			}
			if user.SessionToken == token {
				userFound = true
				if time.Now().Before(expiryTime) {
					isValid = true
					return nil
				} else {
					return errors.New("token expired")
				}

			}
		}

		if !userFound {
			return errors.New("user not found")
		}
		return nil
	})
	if err != nil {
		return false, err
	}

	return isValid, nil
}
