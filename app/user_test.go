package app

import (
	"GoPass/backend/controllers"
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

	dataUser, err := controllers.GetUserInfo(db, user)
	if err != nil {
		t.Fatalf("Error receiving user data")
	}

	fmt.Println(dataUser)
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
	controllers.ChangeUserPassword(db, user, passUser, newPass)

	NewUserInfo, err := controllers.GetUserInfo(db, user)
	if err != nil {
		t.Fatalf("Fail to get UserInfo from controllers.GetUserInfo")
	}
	fmt.Printf("NEW:%v\n", NewUserInfo)
}
