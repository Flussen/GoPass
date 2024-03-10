package components

import (
	"GoPass/backend/controllers"
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
func VerifySessionToken(db *bbolt.DB, username, token string) (bool, error) {

	var isValid bool
	var user models.User

	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
		}
		if err := json.Unmarshal(userBytes, &user); err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		expiryTime, err := time.Parse(time.RFC3339, user.TokenExpiry)
		if err != nil {
			return eh.NewGoPassError("error to parse time from TokenExpiry to RFC3339")
		}
		if time.Now().Before(expiryTime) {
			isValid = true
			return nil
		} else {
			isValid = false
			return nil
		}

	})
	if err != nil {
		return isValid, err
	}

	if !isValid {
		user.TokenExpiry = ""
		user.SessionToken = ""

		err := controllers.UpdateUser(db, username, user)
		if err != nil {
			return false, eh.NewGoPassError("Internal server error, by update the newUser in verify token")
		}
	}

	return isValid, nil
}

func Logout(db *bbolt.DB, username string) error {
	userModel, err := controllers.GetUserInfo(db, username)
	if err != nil {
		return eh.NewGoPassErrorf(eh.ErrLogicFunctionName, "Logout in session tokenhandler")
	}

	userModel.SessionToken = ""
	userModel.TokenExpiry = ""
	err = controllers.UpdateUser(db, username, *userModel)
	if err != nil {
		return eh.NewGoPassErrorf(eh.ErrLogicFunctionName, "Logout in session tokenhandler")
	}
	return nil
}
