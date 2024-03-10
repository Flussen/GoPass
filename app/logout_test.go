package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

func TestLogout(t *testing.T) {
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

	var result models.Receive

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Errorf("json.Unmarshal failed: %v", err)
	}

	isValid, err := app.GetTokenVerification(user, result.Token)
	if err != nil || !isValid {
		t.Fatalf("ERROR: %v", err)
	}

	dataByte, err := app.GetUserInfo(user)
	if err != nil {
		t.Fatalf("ERROR: %v", err)
	}
	var data models.User

	if err := json.Unmarshal([]byte(dataByte), &data); err != nil {
		t.Fatalf("ERROR: %v", err)
	}

	fmt.Println(data)

	if isValid {
		err := app.DoLogout(user)
		if err != nil {
			t.Fatalf("ERROR: %v", err)
		}

		dataByte2, err := app.GetUserInfo(user)
		if err != nil {
			t.Fatalf("ERROR: %v", err)
		}
		var data2 models.User

		if err := json.Unmarshal([]byte(dataByte2), &data2); err != nil {
			t.Fatalf("ERROR: %v", err)
		}
		fmt.Println(data2)
	}

}
