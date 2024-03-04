package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

type User struct {
	Token   string `json:"token"`
	UserKey string `json:"userKey"`
}

var (
	user     = "UserTest"
	passUser = "UserPassword"
	mailUser = "test@example.com"
)

var (
	passToSave     = "testpass1"
	usernameToSave = "User15"
)

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

	js, err := app.DoLogin(user, passUser)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	var userdata User

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
