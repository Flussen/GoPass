package profile

import (
	database "GoPass/backend/db"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"
	"sync"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func UpdateProfile(db *bbolt.DB, account string, newModel models.UserRequest) error {

	if account == "" {
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

		userBytes := bucket.Get([]byte(account))
		if userBytes == nil {
			return eh.ErrUserNotFound
		}

		var userOriginalData models.User

		err := json.Unmarshal(userBytes, &userOriginalData)
		if err != nil {
			return eh.NewGoPassError(eh.ErrUnmarshal)
		}

		userOriginalData.Account = newModel.Account
		userOriginalData.Email = newModel.Email
		userOriginalData.Config = newModel.Config

		bytes, err := json.Marshal(userOriginalData)
		if err != nil {
			return eh.NewGoPassError(eh.ErrMarshal)
		}

		return bucket.Put([]byte(account), bytes)
	})
}

// ChangeUserPassword changes a user's password in the database.
func ChangeUserPassword(db *bbolt.DB, account, originalPwd, newPwd string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("user bucket not found")
			return eh.ErrInternalServer
		}

		user, err := GetAccounInfo(db, account)
		if err != nil {
			return eh.ErrNotFound
		}

		if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(originalPwd)); err != nil {
			return eh.ErrInvalidCredentils
		}

		passwordHashed, err := bcrypt.GenerateFromPassword([]byte(newPwd), 15)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		user.Password = string(passwordHashed)

		accountByte, err := json.Marshal(user)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		err = bucket.Put([]byte(account), accountByte)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		return nil
	})
}

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

// GetUserInfo retrieves user information from the database
func GetAccounInfo(db *bbolt.DB, account string) (models.User, error) {

	var storedUser models.User
	err := db.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
		}

		userBytes := b.Get([]byte(account))
		if userBytes == nil {
			return eh.ErrUserNotFound
		}

		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		return models.User{}, err
	}

	return storedUser, nil
}
