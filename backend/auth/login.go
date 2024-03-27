package auth

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/sessiontoken"
	"encoding/json"
	"errors"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func Login(db *bbolt.DB, username, password string) ([]byte, error) {

	if username == "" || password == "" {
		return nil, eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	var storedUser models.User

	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New(eh.ErrUserNotFound)
		}

		return json.Unmarshal(userBytes, &storedUser)
	})

	if err != nil {
		eh.NewGoPassErrorf("error searching for user: %v", err)
		return nil, errors.New(eh.ErrInvalidCredentils)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return nil, errors.New(eh.ErrInvalidCredentils)
	}

	token, err := sessiontoken.CreateNewToken(storedUser.ID, storedUser.Account)
	if err != nil {
		return nil, err
	}
	userKey := storedUser.UserKey

	err = sessiontoken.SaveSessionToken(db, username, token, userKey)
	if err != nil {
		return nil, eh.NewGoPassErrorf("error storing session token: %v", err)
	}

	result, err := json.Marshal(map[string]string{"token": token, "userKey": userKey})
	if err != nil {
		return nil, err
	}

	return result, nil
}
