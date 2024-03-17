package app

import (
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

func TestGetPasswordByID(t *testing.T) {
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

	id1, err := app.DoSaveUserPassword(user, "User54", "Google", "passforGoogle", "", userdata.UserKey)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	id2, err := app.DoSaveUserPassword(user, "Pedrito", "Youtube", "passForYoutube", "", userdata.UserKey)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}

	data1, err := controllers.UserPasswordByID(db, user, id1)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}

	data2, err := controllers.UserPasswordByID(db, user, id2)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}

	var password1 models.Password
	var password2 models.Password

	err = json.Unmarshal(data1, &password1)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	err = json.Unmarshal(data2, &password2)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	fmt.Println(password1)
	fmt.Println(password2)
}
