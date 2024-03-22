package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

// ChangeUserPassword changes a user's password in the database.
func ChangeUserPassword(db *bbolt.DB, username, originalPwd, newPwd string) error {
	// Check that fields are not empty.
	if username == "" || originalPwd == "" || newPwd == "" {
		return eh.NewGoPassError("fields cannot be empty")
	}

	// Retrieve user information.
	userInfo, err := GetUserInfo(db, username)
	if err != nil {
		return eh.NewGoPassErrorf("%v", err)
	}

	// Compare original password with password stored in the database.
	err = bcrypt.CompareHashAndPassword([]byte(userInfo.Password), []byte(originalPwd))
	if err != nil {
		return eh.NewGoPassError(eh.ErrInvalidCredentils)
	}

	// Generate a new password hash.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPwd), 15)
	if err != nil {
		log.Println("Hashing failure")
		return eh.NewGoPassError("Hashing failure")
	}

	// Create a new user model with the updated password.
	userInfo.Password = string(hashedPassword)

	// Update user information in the database.
	err = UpdateUser(db, username, *userInfo)
	if err != nil {
		return eh.NewGoPassError("Update user method failed!")
	}

	return nil
}

// UpdateUser updates a user's information in the database.
func UpdateUser(db *bbolt.DB, username string, newModel models.User) error {
	// Serialize the new user model.
	userBytes, err := json.Marshal(newModel)
	if err != nil {
		return err
	}

	// Update user information in the database.
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
