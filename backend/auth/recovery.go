package auth

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func NewRecovery(db *bbolt.DB, account, newPassword string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte("Users"))
		if bucket == nil {
			eh.NewGoPassError(eh.ErrInternalServer)
		}

		bytes := bucket.Get([]byte(account))
		if bytes == nil {
			eh.NewGoPassError(eh.ErrUserNotFound)
		}

		var user models.User

		err := json.Unmarshal(bytes, &user)
		if err != nil {
			return err
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(newPassword)); err == nil {
			return eh.NewGoPassError("the old password cannot be the same as the new password")
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), 15)
		if err != nil {
			return eh.NewGoPassError(eh.ErrInternalServer)
		}

		user.Password = string(hashed)

		bytes, err = json.Marshal(user)
		if err != nil {
			return err
		}

		return bucket.Put([]byte(account), bytes)
	})
}
