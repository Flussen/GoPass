package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

// TestDeleteUserPassword verifies the functionality of the DoDeleteUserPassword method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, saves a password, deletes it, and checks if the password was successfully deleted.
// If any step of the process fails, the test fails with an error message.
func TestDeleteUserPassword(t *testing.T) {
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

	for _, pwd := range pwdsContainer.Passwords {
		err := app.DoDeleteUserPassword(user, pwd.Id)
		if err != nil {
			t.Fatalf("Error DoDeleteUserPassword: %v", err)
		}
	}

	pwdsJSONafter, err := app.GetUserPasswords(user)
	if err != nil {
		t.Fatalf("GetUserPasswords failed after deletion: %v", err)
	}

	var pwdsContainerAfter models.PasswordsContainer
	err = json.Unmarshal([]byte(pwdsJSONafter), &pwdsContainerAfter)
	if err != nil {
		t.Fatalf("Error unmarshalling password after deletion: %v", err)
	}

	if len(pwdsContainerAfter.Passwords) > 0 {
		t.Fatalf("Password was not successfully deleted, passwords: %v", pwdsContainerAfter.Passwords)
	}

	fmt.Println("The password was successfully deleted.")
}
