package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"time"

	"go.etcd.io/bbolt"
)

// Save session token to database.
// The format that saves the data is in RFC3339 equivalent to 2006-01-02T15:04:05Z07:00
func StoreSessionToken(DB *bbolt.DB, username, token string, expiry time.Time) error {

	return DB.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}

		var user models.User
		err := json.Unmarshal(userBytes, &user)
		if err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		user.SessionToken = token
		user.TokenExpiry = expiry.Format(time.RFC3339)

		updateUserBytes, err := json.Marshal(user)
		if err != nil {
			return eh.NewGoPassError(eh.ErrMarshal)
		}
		return b.Put([]byte(username), updateUserBytes)
	})
}
