package auth

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/response"
	"GoPass/backend/sessiontoken"
	"encoding/json"
	"errors"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func Login(db *bbolt.DB, username, password string) (response.Login, error) {

	if username == "" || password == "" {
		return response.Login{}, eh.NewGoPassError(eh.ErrEmptyParameters)
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
		return response.Login{}, errors.New(eh.ErrInvalidCredentils)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return response.Login{}, errors.New(eh.ErrInvalidCredentils)
	}

	token, err := sessiontoken.CreateNewToken(storedUser.ID, storedUser.Account)
	if err != nil {
		return response.Login{}, err
	}
	userKey := storedUser.UserKey

	err = sessiontoken.SaveSessionToken(db, username, token, userKey)
	if err != nil {
		return response.Login{}, eh.NewGoPassErrorf("error storing session token: %v", err)
	}

	response := response.Login{
		Token:   token,
		UserKey: userKey,
	}

	return response, nil
}
