package recovery

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"

	"go.etcd.io/bbolt"
)

func CheckSeeds(db *bbolt.DB, account string, seeds []string) error {

	if account == "" || seeds == nil {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	return db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte("Users"))
		if bucket == nil {
			return eh.NewGoPassError(eh.ErrInternalServer)
		}

		userByte := bucket.Get([]byte(account))

		var user models.User

		err := json.Unmarshal(userByte, &user)
		if err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		if len(seeds) != len(user.Seeds) {
			return eh.NewGoPassError(eh.ErrInvalidCredentils)
		}

		for i, seed := range seeds {
			if seed != user.Seeds[i] {
				return eh.NewGoPassError(eh.ErrInvalidCredentils)
			}
		}

		return nil
	})
}
