package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"encoding/json"
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
func Test_login_data_receive(t *testing.T) {
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
		name          string
		user          string
		password      string
		expectErr     bool
		tokenLength   int
		userKeyLength int
	}{
		{
			"correct login credentials",
			"User",
			"password",
			false,
			0,
			0,
		},
		{
			"invalid user",
			"invalidUser",
			"password",
			true,
			0,
			0,
		},
		{
			"invalid password",
			"User",
			"invalidPassword",
			true,
			0,
			0,
		},
		{
			"token 36 characters",
			"User",
			"password",
			false,
			36,
			0,
		},
		{
			"userKey 32 characters",
			"User",
			"password",
			false,
			0,
			32,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			datajs, err := app.DoLogin(tt.user, tt.password)
			var receive models.Receive
			_ = json.Unmarshal([]byte(datajs), &receive)
			if tt.expectErr {
				assert.Empty(receive.Token, "Expected nil data")
				assert.Empty(receive.UserKey, "Expected nil data")
				assert.Error(err, "Expected error if is nil")
			} else {
				assert.NotEmpty(receive.Token, "Expected return data")
				assert.NotEmpty(receive.UserKey, "Expected return data")
				assert.NoErrorf(err, "Expected nil error! %v", err)
			}
			if !tt.expectErr && tt.tokenLength > 0 {
				assert.Len(receive.Token, tt.tokenLength, "%v length expected for token", tt.tokenLength)
			}
			if !tt.expectErr && tt.userKeyLength > 0 {
				assert.Len(receive.UserKey, tt.userKeyLength, "%v length expected for token", tt.userKeyLength)
			}
		})
	}

}
