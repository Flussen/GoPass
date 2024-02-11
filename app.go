package main

import (
	database "GoPass/backend/db"
	"GoPass/backend/models"
	"encoding/json"
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
	"golang.org/x/crypto/bcrypt"
)

// App struct
type App struct {
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// Login is called when the user clicks the login button
func (a *App) Login(username, password string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()

	var storedUser models.User

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("bucket de usuarios no encontrado")
		}

		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("usuario no encontrado")
		}

		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		log.Printf("Error al buscar al usuario: %v", err)
		return "", errors.New("credenciales inválidas")
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return "", errors.New("credenciales inválidas")
	}

	token := uuid.New().String()
	expiry := time.Now().Add(730 * time.Hour)
	err = a.StoreSessionToken(username, token, expiry)
	if err != nil {
		log.Printf("Error storing session token: %v", err)
		return "", errors.New("no se pudo iniciar sesión correctamente")
	}

	// Retorna el token como confirmación de login exitoso
	return token, nil
}

func (a *App) StoreSessionToken(username, token string, expiry time.Time) error {
	DB := database.OpenDB()
	defer DB.Close()

	return DB.Update(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("user bucket not found")
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
			return errors.New("bucket de usuarios no encontrado")
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
					return errors.New("Token expired") // Token válido
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

// Register registers a new user with the given username, email and password. Is Called when the user clicks the register button.
func (a *App) Register(username, email, password string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	if username == "" || password == "" {
		return false, errors.New("credenciales inválidas")
	}

	exists, err := models.CheckUserExists(DB, username, email)
	if err != nil {
		log.Printf("Error al comprobar la existencia del usuario: %v", err)
		return false, err
	}
	if exists {
		return false, errors.New("el usuario o el correo electrónico ya existen")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Fallo de hashing")
	}

	newUser := models.User{
		ID:        uuid.New().String(),
		Username:  username,
		Email:     email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now(),
	}

	if err := models.CreateUser(DB, newUser); err != nil {
		log.Printf("Failed to create user: %v", err)
		return false, err
	} else {
		return true, nil
	}
}

// GetUserPasswords get the password of the user with the given username
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

// Test for frontend development
func (a *App) Greet(username string) (string, error) {
	DB := database.OpenDB()
	defer DB.Close()
	return "Great!!", nil
}

// Delete a password saved in the database by the given username and service. Is called when the user clicks the delete button.
func (a *App) DeletePassword(username, service string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.DeletePass(DB, username, service)
}

func (a *App) ListUsers(userIDs []string, service string, db *bbolt.DB) ([]*models.User, error) {
	return models.GetUsersConcurrently(db, userIDs)
}

func (a *App) GetVersion() string {
	return "0.0.1-ALPHA"
}
