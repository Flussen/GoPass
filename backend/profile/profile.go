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
func ChangeAccountPassword(db *bbolt.DB, account, originalPwd, newPwd string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("user bucket not found")
			return eh.ErrInternalServer
		}

		userByte := bucket.Get([]byte(account))
		if userByte == nil {
			return eh.ErrNotFound
		}
		var user models.User
		json.Unmarshal(userByte, &user)

		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(originalPwd))
		if err != nil {
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
func GetUsersConcurrently(db *bbolt.DB) ([]models.User, error) {
	var users []models.User

	resultChan := make(chan models.User)
	errorChan := make(chan error)
	var wg sync.WaitGroup

	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("Users bucket not found")
			return eh.ErrInternalServer
		}

		c := bucket.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			wg.Add(1)
			go func(val []byte) {
				defer wg.Done()

				var user models.User
				if err := json.Unmarshal(val, &user); err != nil {
					errorChan <- err
					return
				}

				resultChan <- user
			}(v)
		}

		return nil
	})

	if err != nil {
		return nil, eh.ErrInternalServer
	}

	go func() {
		wg.Wait()
		close(resultChan)
		close(errorChan)
	}()

	for user := range resultChan {
		user.Password = ""
		users = append(users, user)
	}

	for e := range errorChan {
		if err == nil {
			err = e
		}
		log.Println(err)
	}

	if users == nil {
		return nil, eh.NewGoPassError("there are no users!")
	}

	return users, err
}

// GetUserInfo retrieves user information from the database
func GetAccountInfo(db *bbolt.DB, account string) (models.User, error) {

	if account == "" {
		return models.User{}, eh.ErrEmptyParameter
	}

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

	if storedUser.ID == "" {
		return models.User{}, eh.ErrNotFound
	}

	return storedUser, nil
}

func DoChangeAccountConfigs(db *bbolt.DB, account string, configs models.Config) error {
	if account == "" {
		return eh.ErrEmptyParameter
	}

	userModel, err := GetAccountInfo(db, account)
	if err != nil {
		return err
	}

	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("bucket users not exist")
			return eh.ErrInternalServer
		}

		userModel.Config.UI = configs.UI
		userModel.Config.Language = configs.Language

		userByte, err := json.Marshal(userModel)

		if err != nil {
			log.Println("marshall error")
			return eh.ErrInternalServer
		}

		return bucket.Put([]byte(account), userByte)
	})
}
