package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestSaveUserPassword verifies the functionality of the DoSaveUserPassword method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// registers a user, saves passwords for the user, retrieves them, and checks their validity.
// If any step of the process fails, the test fails with an error message.
func Test_save_user_password(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	const (
		userTest  = "User"
		emailTest = "email@hotmail.com"
		passTest  = "password"
	)

	// Register process
	_, err := app.DoRegister(userTest, emailTest, passTest)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	js, err := app.DoLogin(userTest, passTest)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	// user, usernameToSave, service, password, userKey string

	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	tests := []struct {
		name            string
		tuser           string
		tusernameToSave string
		tservice        string
		tpassword       string
		tuserKey        string
		expectedErr     bool
		checkData       bool
	}{
		{
			"correct test for save a new password",
			"User",
			"userTest1",
			"google",
			"superPassword",
			userdata.UserKey,
			false,
			false,
		},
		{
			"empty inputs",
			"User",
			"userTest2",
			"",
			"",
			userdata.UserKey,
			true,
			false,
		},
		{
			"empty userKey",
			"User",
			"userTest3",
			"google",
			"superPassword",
			"",
			true,
			false,
		},
		{
			"empty User",
			"",
			"test2",
			"google",
			"superPassword",
			userdata.UserKey,
			true,
			false,
		},
		{
			"saving check test correct",
			"User",
			"logintoGoogle",
			"google",
			"superPassword",
			userdata.UserKey,
			false,
			true,
		},
		{
			"try saving with empty data and check data",
			"User",
			"",
			"google",
			"superPassword",
			userdata.UserKey,
			true,
			true,
		},
	}

	for _, tt := range tests {
		ttest := t.Run(tt.name, func(t *testing.T) {
			id, err := app.DoSaveUserPassword(tt.tuser, tt.tusernameToSave, tt.tuser, tt.tpassword, tt.tuserKey)
			if tt.expectedErr {
				assert.Empty(t, id, "expect empty for the id")
				assert.NotNil(t, err, "expect NOT nil for err")
			} else {
				assert.NotEmpty(t, id, "expect not empty for the id")
				assert.Nil(t, err, "expect nil for err")
			}
			if tt.checkData {
				passwords, _ := app.GetUserPasswords(userTest)

				var pwdsContainer models.PasswordsContainer

				err = json.Unmarshal([]byte(passwords), &pwdsContainer)
				if err != nil {
					t.Error("Error by Unmarshal")
				}

				for _, v := range pwdsContainer.Passwords {
					if tt.expectedErr {
						assert.Empty(t, v, "there should not be any saved password")
					} else {
						assert.NotEmpty(t, v, "cannot be empty for the passwords")
					}
				}
			}
			app.DoDeleteUserPassword(userTest, id) // we will delete every password to make sure it doesn't interfere with other test
		})

		if ttest == true {
			fmt.Printf("\nTest: %v passed ✅", tt.name)
		}
	}
}
