package app

import (
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
	"time"
)

func TestToken(t *testing.T) {
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
		t.Fatalf("DoRegister failed: %v", err)
	}

	var result models.Receive

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	newTime := time.Date(2024, time.January, 1, 21, 0, 0, 0, time.UTC).Format(time.RFC3339)

	data, err := app.GetUserInfo(user)
	if err != nil {
		t.Fatal(err)
	}
	var dataUser models.User
	if err := json.Unmarshal([]byte(data), &dataUser); err != nil {
		t.Fatal(err)
	}

	// _ = newTime
	// to try invalid token, change to:
	dataUser.TokenExpiry = newTime

	if err = controllers.UpdateUser(db, user, dataUser); err != nil {
		t.Fatalf("UpdateUser failed: %v", err)
	}

	fmt.Println(dataUser)

	value, err := app.GetTokenVerification(user, result.Token)
	if err != nil {
		t.Fatalf("internal error %v", err)
	}
	if !value {
		fmt.Printf("❌ Token %v is not valid", result.Token)
	} else {
		fmt.Printf("✅ Token %v is valid!", result.Token)
	}

	// updated user after token verification
	datajson, err := app.GetUserInfo(user)
	if err != nil {
		t.Fatal(err)
	}

	err = json.Unmarshal([]byte(datajson), &dataUser)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Printf("\nNEWDATA:%v", dataUser)
}
