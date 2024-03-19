package sessiontoken

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"

	"go.etcd.io/bbolt"
)

func SaveSessionToken(db *bbolt.DB, username, token, userKey string) error {

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
		b, err := tx.CreateBucketIfNotExists([]byte("LastSessionSaved"))
		if err != nil {
			return err
		}

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
