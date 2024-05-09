package sessiontoken

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"

	"go.etcd.io/bbolt"
)

const BUCKETSESSION string = "LastSessionSaved"
const KEYSESSION string = "lastsession"

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
		b, err := tx.CreateBucketIfNotExists([]byte(BUCKETSESSION))
		if err != nil {
			return err
		}

		return b.Put([]byte(KEYSESSION), json)
	})
}

func CleanSessionToken(db *bbolt.DB) error {

	err := db.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte(BUCKETSESSION))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		err := b.Delete([]byte(KEYSESSION))
		if err != nil {
			return err
		}

		if b.Get([]byte(KEYSESSION)) != nil {
			return eh.NewGoPassErrorf("lastsession data is not deleted, err: %v", err)
		}

		return nil
	})
	if err != nil {
		return err
	}
	return nil
}

func GetSession(db *bbolt.DB) (models.LastSession, error) {
	var lastSession models.LastSession
	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(BUCKETSESSION))
		if bucket == nil {
			return eh.ErrNotFound
		}

		sessionBytes := bucket.Get([]byte(KEYSESSION))
		if sessionBytes == nil {
			return eh.ErrNotFound
		}

		err := json.Unmarshal(sessionBytes, &lastSession)
		if err != nil {
			log.Println("Unmarshal error")
			return eh.ErrInternalServer
		}

		return nil
	})
	if err != nil {
		return models.LastSession{}, err
	}

	ok, err := VerifyToken(db, lastSession.Token)
	if err != nil || !ok {
		err := CleanSessionToken(db)
		if err != nil {
			log.Println(err)
			return models.LastSession{}, eh.ErrInternalServer
		}
	}

	return lastSession, nil
}
