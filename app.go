package main

import (
	// Package imports
	database "GoPass/backend/db" // Importing a custom package, renamed for clarity
	"GoPass/backend/models"      // Importing another custom package

	"encoding/json" // Package for encoding and decoding JSON
	"errors"        // Package for error handling
	"log"           // Package for logging messages
	"math/rand"     // Package for generating random numbers
	"time"          // Package for handling time

	"github.com/google/uuid"     // Package for generating unique UUIDs
	"go.etcd.io/bbolt"           // Package for handling Bolt databases
	"golang.org/x/crypto/bcrypt" // Package for password hashing
)

// App struct
type App struct{}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Login is called when the user clicks the login button
func (a *App) Login(username, password string) (string, error) {
	// Open the database
	DB := database.OpenDB()
	defer DB.Close() // Ensure the database is closed at the end of the function or when returning

	var storedUser models.User // Variable to store the retrieved user from the database

	// Perform a read-only transaction on the database
	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users")) // Get the "Users" bucket from the database
		if b == nil {
			return errors.New("'users' bucket not found") // Return an error if the bucket is not found
		}

		// Get the user data by username
		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("user not found") // Return an error if the user is not found
		}

		// Decode the user data into the user structure
		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		log.Printf("error searching for user: %v", err)
		return "", errors.New("invalid credentials")
	}

	// Compare the hashed password with the provided password
	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate a new session token
	token := uuid.New().String()
	expiry := time.Now().Add(730 * time.Hour)

	// Store the session token in the database
	err = a.StoreSessionToken(username, token, expiry)
	if err != nil {
		log.Printf("error storing session token: %v", err)
		return "", errors.New("failed to log in successfully")
	}

	// Returns the token as confirmation of successful login
	return token, nil
}

// StoreSessionToken stores the session token in the database
func (a *App) StoreSessionToken(username, token string, expiry time.Time) error {
	DB := database.OpenDB()
	defer DB.Close()

	return DB.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("user not found")
		}

		var user models.User
		err := json.Unmarshal(userBytes, &user)
		if err != nil {
			return err
		}

		user.SessionToken = token
		user.TokenExpiry = expiry

		updateUserBytes, err := json.Marshal(user)
		if err != nil {
			return err
		}
		return b.Put([]byte(username), updateUserBytes)
	})
}

// VerifySessionToken verifies the validity of a session token
func (a *App) VerifySessionToken(token string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	var (
		isValid   bool
		userFound bool
	)

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("'users' bucket not found")
		}

		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			var user models.User
			if err := json.Unmarshal(v, &user); err != nil {
				return errors.New("error parsing user")
			}
			if user.SessionToken == token {
				userFound = true
				if time.Now().Before(user.TokenExpiry) {
					isValid = true
					return nil
				} else {
					return errors.New("token expired")
				}

			}
		}

		if !userFound {
			return errors.New("user not found")
		}
		return nil
	})

	if err != nil {
		return false, err
	}

	return isValid, nil
}

// Register registers a new user with the given username, email, and password
func (a *App) Register(username, email, password string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	if username == "" || password == "" {
		return false, errors.New("invalid credentials")
	}

	exists, err := models.CheckUserExists(DB, username, email)
	if err != nil {
		log.Printf("error checking for user existence: %v", err)
		return false, err
	}
	if exists {
		return false, errors.New("the user or email already exists")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Hashing failure")
	}

	newUser := models.User{
		ID:        uuid.New().String(),
		Username:  username,
		Email:     email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}

	if err := models.CreateUser(DB, newUser); err != nil {
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
func (a *App) SaveUserPassword(username, service, password string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.SavePassword(DB, username, service, password)
}

// Greet test for frontend development
func (a *App) Greet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}

// DeletePassword deletes a password saved in the database by the given username and service
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
	var (
		weak   = "Very weak"
		medium = "Medium"
		high   = "trong"
	)

	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:?><"
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

// GetVersion returns the version of the application
func (a *App) GetVersion() string {
	return "0.0.1-ALPHA"
}
