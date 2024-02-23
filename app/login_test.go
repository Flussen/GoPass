package app

import (
	"fmt"
	"testing"
)

func TestDoLogin(t *testing.T) {
	db, cleanup := createTestDB(t)
	defer cleanup()

	app := &App{DB: db}
	// Register process
	success, err := app.DoRegister("testuser", "test@example.com", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}
	if !success {
		t.Errorf("DoRegister was not successful")
	}

	token, userKey, err := app.DoLogin("testuser", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	} else {
		fmt.Printf("Login successful\nToken: %v\nUserKey: %v", token, userKey)
	}
}
