package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
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
	js, err := app.DoLogin("testuser", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}

	var result models.Receive

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Errorf("json.Unmarshal failed: %v", err)
	}
	fmt.Printf("DATA: %s\n", result)
	fmt.Printf("Token: %s\n", result.Token)
	fmt.Printf("TUserKey: %s\n", result.UserKey)
}

// TestSaveUserPassword verifies the functionality of the DoSaveUserPassword method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, saves passwords for the user, retrieves them, and checks their validity.
// If any step of the process fails, the test fails with an error message.
func TestSaveUserPassword(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}

	// Register process
	success, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatalf("DoRegister was not successful")
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
	id2, err := app.DoSaveUserPassword(user, "Pedrito", "Youtube", "passForYoutube", userdata.UserKey)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	_ = id
	_ = id2

	pwdsJSON, err := app.GetUserPasswords(user)
	if err != nil {
		t.Fatalf("GetUserPasswords failed: %v", err)
	}

	var pwdsContainer models.PasswordsContainer
	err = json.Unmarshal([]byte(pwdsJSON), &pwdsContainer)
	if err != nil {
		t.Fatalf("Error unmarshalling passwords: %v", err)
	}

	for i, pwd := range pwdsContainer.Passwords {
		pass, err := app.ShowPassword(user, pwd.Id, userdata.UserKey)
		if err != nil {
			t.Fatalf("ShowPassword failed: %v", err)
		}
		fmt.Printf("_%d_\nUser: %s\nIDPass: %s\nTitle Pass: %s\nPass: %s\nUsername: %s\nCreatedDate: %s\n", i, user, pwd.Id, pwd.Title, pass, pwd.Username, pwd.CreatedDate)
	}

}

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
		t.Fatalf("Error unmarshalling passwords after deletion: %v", err)
	}

	if len(pwdsContainerAfter.Passwords) > 0 {
		t.Fatalf("Passwords were not successfully deleted, remaining passwords: %v", pwdsContainerAfter.Passwords)
	}

	fmt.Println("All passwords were successfully deleted.")
}

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

	var (
		newTitle = "Apple Music"
		newUser  = "UserApple254"
		newPwd   = "passForApple"
	)

	for _, pwd := range pwdsContainer.Passwords {
		err := app.DoUpdateUserPassword(user, pwd.Id, userdata.UserKey, newTitle, newUser, newPwd)
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
		t.Fatalf("Error unmarshalling passwords after deletion: %v", err)
	}

	if len(pwdsContainerAfter.Passwords) > 0 {
		t.Fatalf("Passwords were not successfully deleted, remaining passwords: %v", pwdsContainerAfter.Passwords)
	}

	fmt.Println("All passwords were successfully deleted.")
}
