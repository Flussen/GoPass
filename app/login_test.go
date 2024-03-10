package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

// TestDoLogin verifies the functionality of the DoLogin method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, and then attempts to log in with valid credentials.
// If the login process fails, the test fails with an error message.
func TestDoLogin(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}
	// Register process
	_, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(user, passUser)
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}

	dataUserJson, err := app.GetUserInfo(user)
	if err != nil {
		t.Errorf("GetUser failed: %v", err)
	}

	var userdata models.User

	err = json.Unmarshal([]byte(dataUserJson), &userdata)
	if err != nil {
		t.Errorf("Unmarshal failed: %v", err)
	}

	var result models.Receive

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Errorf("json.Unmarshal failed: %v", err)
	}
	// fmt.Printf("DATA: %s\n", result)
	// fmt.Printf("Token: %s\n", result.Token)
	// fmt.Printf("TUserKey: %s\n", result.UserKey)
	fmt.Println(userdata)
}
