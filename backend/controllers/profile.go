package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"

	"go.etcd.io/bbolt"
)

func UpdateProfile(db *bbolt.DB, username string, newModel models.UserRequest) error {

	if username == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	if newModel.Config.Groups == nil || newModel.Config.UI == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte("Users"))
		if bucket == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		userBytes := bucket.Get([]byte(username))
		if userBytes == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}

		var userOriginalData models.User

		err := json.Unmarshal(userBytes, &userOriginalData)
		if err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		userOriginalData.Username = newModel.Username
		userOriginalData.Email = newModel.Email
		userOriginalData.Config = newModel.Config

		bytes, err := json.Marshal(userOriginalData)
		if err != nil {
			return eh.NewGoPassError(eh.ErrMarshal)
		}

		return bucket.Put([]byte(username), bytes)
	})
}
