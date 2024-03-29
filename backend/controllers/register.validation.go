package controllers

import (
	eh "GoPass/backend/errorHandler"
	userkeyhandler "GoPass/backend/userKeyHandler"
	"errors"
	"log"
	"regexp"

	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

func validateEmail(email string) bool {

	regex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return regex.MatchString(email)
}

func RegistryChecker(DB *bbolt.DB, username, email, password string) error {

	if username == "" || password == "" {
		return eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	if !validateEmail(email) {
		return eh.NewGoPassError("email is not valid")
	}

	exists, err := CheckUserExists(DB, username, email)
	if err != nil {
		log.Printf("error checking for user existence: %v", err)
		return err
	}
	if exists {
		return eh.NewGoPassError("the user or email already exists!")
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
