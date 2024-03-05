package app

import (
	"log"
	"testing"
)

var (
	user     = "UserTest"
	passUser = "UserPassword"
	mailUser = "test@example.com"
)

// TestDoRegister verifies the functionality of the DoRegister method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// and then attempts to register a user using the DoRegister method.
// If an error occurs during the registration process, the test fails with a fatal error message.
// If the registration process is not successful, the test also fails with a fatal error message.
func TestDoRegister(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}

	success, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatal("The registration process was not successful!")
	}

	_, err = app.DoRegister(user, mailUser, passUser)
	if err == nil {
		t.Fatal("An error was expected when trying to register an existing user, but none was received.")
	}

	log.Printf("ERROR: %v", err)
}
