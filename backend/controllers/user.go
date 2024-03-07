package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func GetUserInfo(db *bbolt.DB, username string) (models.User, error) {

	var storedUser models.User
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}

		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		return models.User{}, err
	}

	return storedUser, nil
}

func ChangeUserPassword(db *bbolt.DB, username, originalPwd, newPwd string) error {
	if username == "" || originalPwd == "" || newPwd == "" {
		return eh.NewGoPassError("fields cannot be empty")
	}

	userInfo, err := GetUserInfo(db, username)
	if err != nil {
		return eh.NewGoPassErrorf("%v", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(userInfo.Password), []byte(originalPwd))
	if err != nil {
		return eh.NewGoPassError(eh.ErrInvalidCredentils)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPwd), 15)
	if err != nil {
		log.Println("Hashing failure")
		return eh.NewGoPassError("Hashing failure")
	}

	userUpdated := models.User{
		ID:           userInfo.ID,
		Username:     userInfo.Username,
		Email:        userInfo.Email,
		Password:     string(hashedPassword),
		UserKey:      userInfo.UserKey,
		CreatedAt:    userInfo.CreatedAt,
		SessionToken: userInfo.SessionToken,
		TokenExpiry:  userInfo.TokenExpiry,
	}

	err = UpdateUser(db, username, userUpdated)
	if err != nil {
		return eh.NewGoPassError("Update user method failed!")
	}

	return nil
}

func UpdateUser(db *bbolt.DB, username string, newModel models.User) error {
	userBytes, err := json.Marshal(newModel)
	if err != nil {
		return err
	}

	return db.Update(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte("Users"))
		if userBucket == nil {
			return eh.NewGoPassErrorf("User %v not found", username)
		}

		err := userBucket.Put([]byte(username), userBytes)
		if err != nil {
			return eh.NewGoPassErrorf("Error when entering new data into the user's database")
		}
		return nil
	})
}
