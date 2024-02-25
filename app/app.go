package app

import (
	// Package imports

	"GoPass/backend/components"
	"GoPass/backend/controllers"
	database "GoPass/backend/db" // Importing a custom package, renamed for clarity
	"GoPass/backend/encryption"
	eh "GoPass/backend/errorHandler"
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
type App struct {
	DB *bbolt.DB
}

// NewApp create an instance for wails to work on in the main package and receive the app
func NewApp() *App {
	return &App{}
}

func NewAppWithDB(db *bbolt.DB) *App {
	return &App{DB: db}
}

/*
   ------------------------------------------------
   Do type function, that are exported in typescript so
   that specific things are done, such as registering, creating
   a login session, they generally perform actions that return
   verification or authentication data.

	->> DO type functions continue below <<--
   ------------------------------------------------
*/

// Login is called when the user clicks the login button
// Will perform various checks on the database bucket,
// if the bucket exists, if the user exists in the bucket,
// if the password is comparable to the hash
// it will also parse the data, decrypt the userKey stored in the database
// and generate a login token. (Expiry in 30 days)
func (a *App) DoLogin(username, password string) (string, string, error) {
	var storedUser models.User

	err := a.DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return eh.NewGoPassError(eh.ErrBucketNotFound)
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

	token := uuid.New().String()
	expiry := time.Now().Add(730 * time.Hour)
	userKey := storedUser.Password

	err = controllers.StoreSessionToken(a.DB, username, token, expiry)
	if err != nil {
		log.Printf("error storing session token: %v", err)
		return "", "", errors.New("failed to log in successfully")
	}

	return token, userKey, nil
}

// Register registers a new user with the given username, email, and password
func (a *App) DoRegister(username, email, password string) (bool, error) {

	err := components.RegistryChecker(a.DB, username, email, password)
	if err != nil {
		return false, err
	}

	hashedPassword, UserKey, err := components.RegistrySecurer(password)
	if err != nil {
		return false, err
	}

	newUser := models.User{
		ID:        uuid.New().String(),
		Username:  username,
		Email:     email,
		Password:  string(hashedPassword),
		UserKey:   UserKey,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	if err := controllers.CreateUser(a.DB, newUser); err != nil {
		log.Printf("failed to create user: %v", err)
		return false, err
	}

	return true, nil
}

// Saves a password for the given username and service
//
//	controllers.SavePassword(DB, username, userKey, service, password) // is the controller for Save the password
func (a *App) DoSaveUserPassword(username, service, password, userKey string) error {
	return controllers.SavePassword(a.DB, username, userKey, service, password)
}

// DeletePassword deletes a password saved in the database by the given username and service.
//
//	controllers.DeletePass(DB, username, service) // is the controller for delete the password in the database
func (a *App) DoDeleteUserPassword(username, service string) error {
	return controllers.DeletePass(a.DB, username, service)
}

/*
   ------------------------------------------------
	Get type functions, they work to receive a specific data,
	they can do decryption processes to receive that data
	but generally they only receive data to export it to the
	typescript frontend.

	->> GET type functions continue below <<--
   ------------------------------------------------
*/

// Verifies the validity of a session token and return to the app
// true if the session is valid and false if the session invalid
//
//	components.VerifySessionToken(DB, token) // is the verificator
func (a *App) GetTokenVerification(token string) (bool, error) {

	isValid, err := components.VerifySessionToken(a.DB, token)
	if err != nil {
		return false, err
	}

	return isValid, nil
}

// Retrieves the passwords of the user with the given username
//
//	components.VerifySessionToken(DB, token) // is the controller for get the user passwords
func (a *App) GetUserPasswords(username string) (map[string]string, error) {
	return controllers.GetUserPasswords(a.DB, username)
}

// Shows the password by the userKey decryption method
//
//	encryption.RevealPassword(encryptedPassword, userKey) // It is the encryption controller
func (a *App) ShowPassword(username, service, userKey string) (string, error) {

	var encryptedPassword string

	err := a.DB.View(func(tx *bbolt.Tx) error {
		userBucket := tx.Bucket([]byte(username))
		if userBucket == nil {
			return eh.NewGoPassError(eh.ErrUserNotFound)
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

	decrypted, err := encryption.RevealPassword(encryptedPassword, userKey)
	if err != nil {
		return "", err
	}

	return decrypted, nil
}

// ListUsers retrieves user information concurrently
//
//	controllers.GetUsersConcurrently(db, userIDs) // is the controller for get users simultaneously
func (a *App) GetListUsers(userIDs []string, service string) ([]*models.User, error) {
	return controllers.GetUsersConcurrently(a.DB, userIDs)
}

// PasswordGenerator generates a random password with a specified
// length and returns its strength level
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

/*
   ------------------------------------------------
	Test type functions, is only for testing the frontend
	get and return information.

	->> GET type functions continue below <<--
   ------------------------------------------------
*/

// Greet test for frontend development
func (a *App) TestGreet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}
