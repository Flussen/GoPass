package app

import "testing"

func TestDoRegister(t *testing.T) {
	db, cleanup := CreateTestDB(t)
	defer cleanup()

	app := &App{DB: db}

	success, err := app.DoRegister("testuser", "test@example.com", "password123")
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}
	if !success {
		t.Errorf("DoRegister was not successful")
	}

}
