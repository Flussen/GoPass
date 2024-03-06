package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

// TestUpdatePassword verifies the functionality of the DoUpdateUserPassword method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, saves a password, updates the password, and checks if the update was successful.
// If any step of the process fails, the test fails with an error message.
func TestUpdatePassword(t *testing.T) {
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
		t.Fatalf("DoLogin failed: %v", err)
	}

	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	id, err := app.DoSaveUserPassword(user, "User54", "Google", "passforGoogle", userdata.UserKey)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	_ = id

	pwdsJSON, err := app.GetUserPasswords(user)
	if err != nil {
		t.Fatalf("GetUserPasswords failed: %v", err)
	}

	var pwdsContainer models.PasswordsContainer
	err = json.Unmarshal([]byte(pwdsJSON), &pwdsContainer)
	if err != nil {
		t.Fatalf("Error unmarshalling passwords: %v", err)
	}

	fmt.Println("Before:", pwdsContainer.Passwords)

	var (
		newTitle = "Apple Music"
		newUser  = "UserApple254"
		newPwd   = "passForApple"
	)

	for _, pwd := range pwdsContainer.Passwords {
		err := app.DoUpdateUserPassword(user, userdata.UserKey, pwd.Id, newTitle, newUser, newPwd)
		if err != nil {
			t.Fatalf("Error DoDeleteUserPassword: %v", err)
		}
	}

	pwdsJSONafter, err := app.GetUserPasswords(user)
	if err != nil {
		t.Fatalf("GetUserPasswords failed after update: %v", err)
	}

	var pwdsContainerAfter models.PasswordsContainer
	err = json.Unmarshal([]byte(pwdsJSONafter), &pwdsContainerAfter)
	if err != nil {
		t.Fatalf("Error unmarshalling passwords after update: %v", err)
	}

	fmt.Println("After:", pwdsContainerAfter.Passwords)
}
