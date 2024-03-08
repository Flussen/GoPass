package app

import (
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

var (
	newPass = "NewPass" // you can't see the original password and the newpassword in the printf,
	// because this is hashed
)

func TestGetUserInfo(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := App{DB: db}

	success, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatalf("DoRegister was not successful")
	}

	var userData models.User

	jsData, err := app.GetUserInfo(user)
	if err != nil {
		t.Fatalf("DoRegister was not successful")
	}
	err = json.Unmarshal([]byte(jsData), &userData)
	if err != nil {
		t.Fatalf("DoRegister was not successful")
	}
	fmt.Println(userData)
}

func TestChangeUserPassword(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := App{DB: db}

	success, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatalf("DoRegister was not successful")
	}

	UserInfo, err := controllers.GetUserInfo(db, user)
	if err != nil {
		t.Fatalf("Fail to get UserInfo from controllers.GetUserInfo")
	}

	fmt.Printf("\n%v\n", UserInfo)
	err = controllers.ChangeUserPassword(db, user, passUser, newPass)
	if err != nil {
		t.Fatal(err)
	}

	NewUserInfo, err := controllers.GetUserInfo(db, user)
	if err != nil {
		t.Fatalf("Fail to get UserInfo from controllers.GetUserInfo")
	}
	fmt.Printf("NEW:%v\n", NewUserInfo)
}
