package components

import (
	"GoPass/backend/controllers"
	userkeyhandler "GoPass/backend/userKeyHandler"
	"errors"
	"log"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func RegistryChecker(DB *bbolt.DB, username, email, password string) error {

	if username == "" || password == "" {
		return errors.New("invalid credentials")
	}

	exists, err := controllers.CheckUserExists(DB, username, email)
	if err != nil {
		log.Printf("error checking for user existence: %v", err)
		return err
	}
	if exists {
		return errors.New("the user or email already exists")
	}
	return nil
}

func RegistrySecurer(password string) ([]byte, string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 15)
	if err != nil {
		log.Println("Hashing failure")
		return nil, "", errors.New("error")
	}

	userKey := userkeyhandler.GenerateRandomUserKey(32) // V2CXXloRbh6jHQRsVavLb4R8qAJ0Oz7B
	return hashedPassword, userKey, nil
}
