package components

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"errors"
	"time"

	"go.etcd.io/bbolt"
)

// Verify that the session is satisfactory.
// First check the database if the bucket exists, if it does not exist it gives an error,
// creates a cursor, receives the data and parses it. then check if the expiration time is still valid
// if all checks were successful, it will return true, else return false with de error
func VerifySessionToken(DB *bbolt.DB, username, token string) (bool, error) {

	var isValid bool

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}

		var user models.User
		if err := json.Unmarshal(userBytes, &user); err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		expiryTime, err := time.Parse(time.RFC3339, user.TokenExpiry)
		if err != nil {
			return eh.NewGoPassError("Error to parse time from TokenExpiry to RFC3339")
		}
		if time.Now().Before(expiryTime) {
			isValid = true
			return nil
		} else {
			return eh.NewGoPassError("invalid time")
		}

	})
	if err != nil {
		return false, err
	}

	return isValid, nil
}
