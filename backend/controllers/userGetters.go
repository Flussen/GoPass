package controllers

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"sync"

	"go.etcd.io/bbolt"
)

// GetUserByID retrieves a user by its ID from the database
func GetUserByID(db *bbolt.DB, userID string) (*models.User, error) {
	var user models.User
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return nil // Bucket doesn't exist
		}
		userBytes := b.Get([]byte(userID))
		if userBytes == nil {
			return nil // User doesn't exist
		}
		return json.Unmarshal(userBytes, &user)
	})
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// GetUserByUsername retrieves a user by its username from the database
func GetUserByUsername(db *bbolt.DB, username string) (*models.User, error) {
	var user models.User
	err := db.View(func(tx *bbolt.Tx) error {
		// Assume users are stored in a bucket named "Users".
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("users bucket not found")
		}

		// Assume username is the key to lookup the user.
		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("user not found")
		}

		// Deserialize user bytes into User structure.
		if err := json.Unmarshal(userBytes, &user); err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUsersConcurrently retrieves user information concurrently
// under develop
func GetUsersConcurrently(db *bbolt.DB, userIDs []string) ([]*models.User, error) {
	var users []*models.User
	var err error

	resultChan := make(chan *models.User)

	var wg sync.WaitGroup

	for _, userID := range userIDs {
		wg.Add(1)
		go func(id string) {
			user, err := GetUserByID(db, id)
			if err != nil {
				log.Printf("Error getting user with ID %s: %v", id, err)
			}
			resultChan <- user
		}(userID)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for range userIDs {
		user := <-resultChan
		if user != nil {
			users = append(users, user)
		}
	}
	return users, err
}

// GetUserPasswords retrieves passwords of the user from the database
func GetUserPasswords(db *bbolt.DB, username string) ([]models.Password, error) {
	var passwords []models.Password

	err := db.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return fmt.Errorf("bucket not found")
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
