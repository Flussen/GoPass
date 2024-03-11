package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// func loginFunc(db *bbolt.DB) func() {
// 	return func() {
// 		value, err :=
// 	}
// }

// TestDoLogin verifies the functionality of the DoLogin method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, and then attempts to log in with valid credentials.
// If the login process fails, the test fails with an error message.
func Test_login(t *testing.T) {
	db, cleanup := CreateTestDB()
	defer cleanup()

	const (
		user      = "UserExists"
		emailUser = "emailexists@hotmail.com"
		passUser  = "password"
	)

	app := &app.App{DB: db}
	// Register process
	_, err := app.DoRegister(user, emailUser, passUser)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(user, passUser)
	if err != nil {
		t.Errorf("DoRegister failed: %v", err)
	}

	dataUserJson, err := app.GetUserInfo(user)
	if err != nil {
		t.Errorf("GetUser failed: %v", err)
	}

	var userdata models.User

	err = json.Unmarshal([]byte(dataUserJson), &userdata)
	if err != nil {
		t.Errorf("Unmarshal failed: %v", err)
	}

	var result models.Receive

	err = json.Unmarshal([]byte(js), &result)
	if err != nil {
		t.Errorf("json.Unmarshal failed: %v", err)
	}
	// fmt.Printf("DATA: %s\n", result)
	// fmt.Printf("Token: %s\n", result.Token)
	// fmt.Printf("TUserKey: %s\n", result.UserKey)
	fmt.Println(userdata)
}

func Test_login_v2(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	app := &app.App{DB: db}
	// Register process
	_, err := app.DoRegister(userTest, emailTest, passTest)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	tests := []struct {
		name      string
		user      string
		password  string
		expectErr bool
	}{
		{
			"correct login credentials",
			"User",
			"password",
			false,
		},
		{
			"invalid user",
			"invalidUser",
			"password",
			true,
		},
		{
			"invalid password",
			"User",
			"invalidPassword",
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := app.DoLogin(tt.user, tt.password)
			if tt.expectErr {
				assert.Error(err, "Expected an error!")
			} else {
				assert.NoErrorf(err, "Expected no error! %v", err)
			}
		})
	}

}
