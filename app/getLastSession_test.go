package app

import (
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
)

func TestGetLastSessionStored(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}
	// Register process
	_, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	_, err = app.DoLogin(user, passUser)
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}

	dataJson, err := app.GetLastSession()
	if err != nil {
		t.Fatal(err)
		return
	}

	var lastSession models.LastSession

	err = json.Unmarshal([]byte(dataJson), &lastSession)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(lastSession)
}

func TestGetLastSessionStored_with_overwritten_lastsession(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	var lastSession models.LastSession

	app := &App{DB: db}
	// Register process
	_, err := app.DoRegister(user, mailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	_, err = app.DoLogin(user, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	dataJson, err := app.GetLastSession()
	if err != nil {
		t.Fatal(err)
		return
	}

	err = json.Unmarshal([]byte(dataJson), &lastSession)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(lastSession)

	if err := app.DoLogout(user); err != nil {
		t.Fatal(err)
	}

	// overwritten login:

	_, err = app.DoLogin(user, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	dataJson, err = app.GetLastSession()
	if err != nil {
		t.Fatal(err)
		return
	}

	err = json.Unmarshal([]byte(dataJson), &lastSession)
	if err != nil {
		t.Fatal(err)
	}

	fmt.Println(lastSession)
}
