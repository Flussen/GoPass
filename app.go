package main

import (
	// Package imports

	"GoPass/backend/components"
	"GoPass/backend/controllers"
	database "GoPass/backend/db" // Importing a custom package, renamed for clarity
	"GoPass/backend/encryption"
	"GoPass/backend/models" // Importing another custom package
	"fmt"

	"encoding/json" // Package for encoding and decoding JSON
	"errors"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"     // Package for generating unique UUIDs
	"go.etcd.io/bbolt"           // Package for handling Bolt databases
	"golang.org/x/crypto/bcrypt" // Package for password hashing
)

/*
App is an empty struct that will add the functions that will
be added to main.go so that wails go compiles. This is the way to
improve the abstraction of the program so that the program scales.
*/
type App struct{}

// NewApp create an instance for wails to work on in the main package and receive the app
func NewApp() *App {
	return &App{}
}

// Login is called when the user clicks the login button
// Will perform various checks on the database bucket,
// if the bucket exists, if the user exists in the bucket,
// if the password is comparable to the hash
// it will also parse the data, decrypt the userKey stored in the database
// and generate a login token. (Expiry in 30 days)
func (a *App) Login(username, password string) (string, string, error) {
	DB := database.OpenDB()
	defer DB.Close()

	var storedUser models.User

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("user not found")
		}

		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		log.Printf("error searching for user: %v", err)
		return "", "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return "", "", errors.New("invalid credentials")
	}

	userKey, err := encryption.DecryptPassword(storedUser.EncryptedUserKey, password)
	if err != nil {
		log.Printf("error decrypting user key: %v", err)
		return "", "", errors.New("failed to decrypt user Key")
	}

	token := uuid.New().String()
	expiry := time.Now().Add(730 * time.Hour)

	err = controllers.StoreSessionToken(DB, username, token, expiry)
	if err != nil {
		log.Printf("error storing session token: %v", err)
		return "", "", errors.New("failed to log in successfully")
	}

	return token, userKey, nil
}

// Verifies the validity of a session token and return to the app
// true if the session is valid and false if the session invalid
//
//	components.VerifySessionToken(DB, token) // is the verificator
func (a *App) TokenVerification(token string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	isValid, err := components.VerifySessionToken(DB, token)
	if err != nil {
		return false, err
	}

	return isValid, nil
}

// Register registers a new user with the given username, email, and password
func (a *App) DoRegister(username, email, password string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	err := components.RegistryChecker(DB, username, email, password)
	if err != nil {
		return false, err
	}

	hashedPassword, encryptedUserKey, err := components.RegistrySecurer(password)
	if err != nil {
		return false, err
	}

	newUser := models.User{
		ID:               uuid.New().String(),
		Username:         username,
		Email:            email,
		Password:         string(hashedPassword),
		EncryptedUserKey: encryptedUserKey,
		CreatedAt:        time.Now().Format(time.RFC3339),
	}

	if err := controllers.CreateUser(DB, newUser); err != nil {
		log.Printf("failed to create user: %v", err)
		return false, err
	} else {
		return true, nil
	}
}

// GetUserPasswords retrieves the passwords of the user with the given username
func (a *App) GetUserPasswords(username string) (map[string]string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return models.GetUserPasswords(DB, username)
}

// SaveUserPassword saves a password for the given username and service
func (a *App) SaveUserPassword(username, service, password, userKey string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.SavePassword(DB, username, userKey, service, password)
}

func (a *App) ShowPassword(username, service, userKey string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()

	var encryptedPassword string

	err := DB.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return fmt.Errorf("user not found")
		}

		encryptedPasswordBytes := userBucket.Get([]byte(service))
		if encryptedPasswordBytes == nil {
			return fmt.Errorf("password not found for service: %s", service)
		}
		encryptedPassword = string(encryptedPasswordBytes)
		return nil
	})

	if err != nil {
		return "", err
	}

	decrypted, err := models.RevealPassword(encryptedPassword, userKey)
	if err != nil {
		return "", err
	}

	return decrypted, nil
}

// Greet test for frontend development
func (a *App) Greet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}

// DeletePassword deletes a password saved in the database by the given username and service.
func (a *App) DeletePassword(username, service string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.DeletePass(DB, username, service)
}

// ListUsers retrieves user information concurrently
func (a *App) ListUsers(userIDs []string, service string, db *bbolt.DB) ([]*models.User, error) {
	return models.GetUsersConcurrently(db, userIDs)
}

// PasswordGenerator generates a random password with a specified length and returns its strength level
func (a *App) PasswordGenerator(lenght int) (string, string) {
	const (
		weak    = "Weak"
		medium  = "Medium"
		high    = "Strong"
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:?><"
	)
	password := make([]byte, lenght)
	for i := range password {
		password[i] = charset[rand.Intn(len(charset))]
	}
	if lenght >= 20 {
		return string(password), high
	}
	if lenght > 10 {
		return string(password), medium
	}
	return string(password), weak
}

// GetVersion returns the version of the application. Example 1.0.1
func (a *App) GetVersion() string {
	return "0.0.2 - ALPHA"
}
