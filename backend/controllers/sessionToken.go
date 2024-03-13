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
func StoreSessionToken(db *bbolt.DB, username, token, userKey string, expiry time.Time) error {

	err := db.Update(func(tx *bbolt.Tx) error {
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
	if err != nil {
		return err
	}

	// encryptedUserKey, err := encryption.EncryptPassword(userKey, goPassSecretKey)
	// if err != nil {
	// 	return err
	// }

	lastSession := models.LastSession{
		Username: username,
		Token:    token,
		UserKey:  userKey,
	}

	json, err := json.Marshal(lastSession)
	if err != nil {
		return err
	}

	return db.Update(func(tx *bbolt.Tx) error {
		// Ensure the bucket exists
		b, err := tx.CreateBucketIfNotExists([]byte("LastSessionSaved"))
		if err != nil {
			return err
		}

		// Use the user's ID as the key to store the serialized value
		return b.Put([]byte("lastsession"), json)
	})
}

func CleanSessionToken(db *bbolt.DB) error {
	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("LastSessionSaved"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		err := b.Delete([]byte("lastsession"))
		if err != nil {
			return err
		}

		if b.Get([]byte("lastsession")) != nil {
			return eh.NewGoPassErrorf("lastsession data is not deleted, err: %v", err)
		}

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}
