package units_tests

import (
	"GoPass/app"
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

func TestAsd(t *testing.T) {
	db, cleanup := CreateTestDB()
	defer cleanup()

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	groups := []string{"datos", "xd"}

	configsDefault := models.Config{
		UI:     "default",
		Groups: groups,
	}

	app := &app.App{DB: db}
	// Register process
	err := app.DoRegister(userTest, emailTest, passTest, configsDefault)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// app.DoLogin(userTest, passTest)

	// data, err := app.GetLastSession()
	// if err != nil {
	// 	t.Fatal(err)
	// }

	data, err := app.GetUserInfo("User")
	if err != nil {
		t.Fatal(err)
	}

	var user models.User

	err = json.Unmarshal([]byte(data), &user)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(user.Config)
}

func TestAsd2(t *testing.T) {
	db, cleanup := CreateTestDB()
	defer cleanup()

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	groups := []string{"datos", "xd"}

	configsDefault := models.Config{
		UI:     "default",
		Groups: groups,
	}

	dataPassword := models.Data{
		Favorite: false,
		Group:    "licences",
		Icon:     "icondefault",
		Status:   "statusdefult",
	}

	app := &app.App{DB: db}
	// Register process
	err := app.DoRegister(userTest, emailTest, passTest, configsDefault)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	data, _ := app.DoLogin(userTest, passTest)
	var response models.Receive
	json.Unmarshal([]byte(data), &response)

	id, err := app.DoSaveUserPassword(userTest, response.UserKey, "test", "title", "pwd", dataPassword)
	if err != nil {
		t.Fatal(err)
	}

	passwordByte, err := app.GetUserPasswordById(userTest, id)
	if err != nil {
		t.Fatal(err)
	}

	var pwd models.Password

	json.Unmarshal([]byte(passwordByte), &pwd)

	// fmt.Println("original:", &pwd)

	err = app.DoUpdateUserPassword(userTest, response.UserKey, id, "newtitle", "newUsername", "newPassword")
	if err != nil {
		t.Fatal(err)
	}

	passwordByte, err = app.GetUserPasswordById(userTest, id)
	if err != nil {
		t.Fatal(err)
	}

	json.Unmarshal([]byte(passwordByte), &pwd)

	// fmt.Println("new update:", &pwd)

	newModel := models.Data{
		Favorite: true,
		Group:    "pepito",
	}

	err = app.DoSetPasswordConfig(id, userTest, newModel)
	if err != nil {
		t.Fatal(err)
	}

	passwordByte, err = app.GetUserPasswordById(userTest, id)
	if err != nil {
		t.Fatal(err)
	}
	err = json.Unmarshal([]byte(passwordByte), &pwd)
	if err != nil {
		t.Fatal(err)
	}

	configsDefault.UI = "black"

	newRequest := models.UserRequest{
		Username: "newUsername",
		Email:    "newmail@hotmail.com",
		Config:   configsDefault,
	}

	err = controllers.UpdateProfile(db, userTest, newRequest)
	if err != nil {
		t.Fatal(err)
	}

	userInfo, err := app.GetUserInfo(userTest)
	if err != nil {
		t.Fatal(err)
	}

	var finallyUser models.User

	json.Unmarshal([]byte(userInfo), &finallyUser)

	fmt.Println(finallyUser)
}
