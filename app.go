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
func (a *App) Login(username, password string) (bool, error) {
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
			// Usuario no encontrado
			return errors.New("usuario no encontrado")
		}

		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		log.Printf("Error al buscar al usuario: %v", err)
		return false, errors.New("credenciales inválidas")
	}

	// Comparar la contraseña del usuario con el hash almacenado
	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		// Contraseña incorrecta
		return false, errors.New("credenciales inválidas")
	}

	// Inicio de sesión exitoso
	return true, nil
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
