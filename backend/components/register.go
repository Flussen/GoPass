package components

import (
	"GoPass/backend/controllers"
	"GoPass/backend/encryption"
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

	userKey, err := userkeyhandler.GenerateRandomUserKey(32)
	if err != nil {
		log.Printf("failed to generate user Key: %v", err)
		return nil, "", errors.New("error")
	}

	encryptedUserKey, err := encryption.EncryptPassword(userKey, password)
	if err != nil {
		log.Printf("failed to encrypt user key: %v", err)
		return nil, "", errors.New("error")
	}

	return hashedPassword, encryptedUserKey, nil
}
