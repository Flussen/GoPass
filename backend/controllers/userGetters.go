package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"
	"sync"

	"go.etcd.io/bbolt"
)

// GetUsersConcurrently retrieves all users in the database
// under develop
func GetUsersConcurrently(db *bbolt.DB) (string, error) {
	var users []*models.User

	resultChan := make(chan *models.User)
	errorChan := make(chan error)

	var wg sync.WaitGroup

	var err error

	db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			log.Println("Users bucket not found")
			return nil
		}

		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			wg.Add(1)
			go func(val []byte) {
				defer wg.Done()

				var user models.User
				if err := json.Unmarshal(val, &user); err != nil {
					errorChan <- err
					return
				}

				resultChan <- &user
			}(v)
		}

		return nil
	})

	go func() {
		wg.Wait()
		close(resultChan)
		close(errorChan)
	}()

	for user := range resultChan {
		users = append(users, user)
	}

	for err := range errorChan {
		log.Printf("Error unmarshalling user: %v", err)
	}

	datajs, err := json.Marshal(users)
	if err != nil {
		log.Printf("Error unmarshalling user: %v", err)
	}

	return string(datajs), err
}

// GetUserPasswords retrieves passwords of the user from the database
func GetUserPasswords(db *bbolt.DB, username string) ([]models.Password, error) {
	var passwords []models.Password

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		return userBucket.ForEach(func(k, v []byte) error {
			var pwd models.Password
			if err := json.Unmarshal(v, &pwd); err != nil {
				return err
			}
			passwords = append(passwords, pwd)
			return nil
		})
	})

	return passwords, err
}

// GetUserInfo retrieves user information from the database
func GetUserInfo(db *bbolt.DB, username string) (*models.User, error) {

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
		return &models.User{}, err
	}

	return &storedUser, nil
}
