package app

import (
	"encoding/json"
	"fmt"
	"testing"
)

type Deserialize struct {
	Token   string `json:"token"`
	UserKey string `json:"userKey"`
}

func TestDoLogin(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}
	// Register process
	success, err := app.DoRegister("testuser", "test@example.com", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}
	if !success {
		t.Errorf("DoRegister was not successful")
	}

	js, err := app.DoLogin("testuser", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}

	var result Deserialize

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Errorf("json.Unmarshal failed: %v", err)
	}
	fmt.Printf("DATA: %s\n", result)
	fmt.Printf("Token: %s\n", result.Token)
	fmt.Printf("TUserKey: %s\n", result.UserKey)
}
