package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

var (
	user2 = "UserTest2"
)

func Test(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := App{DB: db}

	success, err := app.DoRegister(user, mailUser, passUser) // "UserTest"
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatalf("DoRegister was not successful")
	}
	success, err = app.DoRegister(user2, "test@gASD.com", passUser) // "UserTest"
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}
	if !success {
		t.Fatalf("DoRegister was not successful")
	}

	data, err := app.GetListUsers()
	if err != nil {
		t.Fatalf("DoRegister was not successful")
	}

	var users []models.User
	err = json.Unmarshal([]byte(data), &users)
	if err != nil {
		t.Fatalf("error Unmarshal")
	}

	for _, v := range users {
		fmt.Println(v)
	}

}
