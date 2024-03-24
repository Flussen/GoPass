package auth

import (
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func Register(db *bbolt.DB, username, email, password string) error {

	err := controllers.RegistryChecker(db, username, email, password)
	if err != nil {
		return err
	}

	hashedPassword, UserKey, err := controllers.RegistrySecurer(password)
	if err != nil {
		return err
	}

	newUser := models.User{
		ID:        uuid.New().String(),
		Username:  username,
		Email:     email,
		Password:  string(hashedPassword),
		UserKey:   UserKey,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	if err := controllers.CreateUser(db, newUser); err != nil {
		return err
	}

	return nil
}
