package main

import (
	database "GoPass/db"
	"GoPass/models"
	"context"
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
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	a.ctx = ctx
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Login(username, password string) (bool, error) {
	DB := database.OpenDB()
	defer DB.Close()

	var storedUser models.User

	err := DB.View(func(tx *bbolt.Tx) error {
		b := tx.Bucket([]byte("Users"))
		if b == nil {
			return errors.New("bucket de usuarios no encontrado")
		}
		log.Println(username)
		userBytes := b.Get([]byte(username))
		if userBytes == nil {
			return errors.New("usuario no encontrado")
		}
		return json.Unmarshal(userBytes, &storedUser)
	})
	if err != nil {
		log.Printf("Error al buscar al usuario: %v", err)
		return false, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return false, errors.New("credenciales inválidas")
	}

	return true, nil
}

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

func (a *App) GetUserPasswords(username string) (map[string]string, error) {
	DB := database.OpenDB()
	defer DB.Close()

	return models.GetUserPasswords(DB, username)
}

func (a *App) SaveUserPassword(username, service, password string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.SavePassword(DB, username, service, password)
}

func (a *App) Greet(username string) (string, error) {
	return "Great!!", nil
}

func (a *App) DeletePassword(username, service string) error {
	DB := database.OpenDB()
	defer DB.Close()
	return models.DeletePass(DB, username, service)
}
