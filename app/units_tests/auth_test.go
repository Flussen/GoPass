package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_registration(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	tests := []struct {
		name      string
		user      string
		password  string
		email     string
		expectErr bool
	}{
		{
			"correct registration",
			"Usertest1",
			"Password1",
			"correct@hotmail.com",
			false,
		},
		{
			"email with uppercase domain",
			"Usertest2",
			"Password1",
			"fakemail@FAKE.com",
			true,
		},
		{
			"email without @ symbol",
			"Usertest3",
			"Password1",
			"fakemailFAKE.com",
			true,
		},
		{
			"email with forbidden characters",
			"Usertest4",
			"Password1",
			"fake*mail@fake.com",
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := app.DoRegister(tt.user, tt.email, tt.password)
			if tt.expectErr {
				assert.Error(err, "Expected an error!")
			} else {
				assert.NoErrorf(err, "Expected nil error! %v", err)
			}
		})
	}
}

func Test_registration_but_there_is_already_a_user_or_a_email(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	const (
		user      = "UserExists"
		emailUser = "emailexists@hotmail.com"
		passUser  = "password"
	)

	app := &app.App{DB: db}

	exists, err := app.DoRegister(user, emailUser, passUser)
	_, _ = exists, err

	tests := []struct {
		name      string
		user      string
		password  string
		email     string
		expectErr bool
	}{
		{
			"User already exists",
			"UserExists",
			"password",
			"emailfree@hotmail.com",
			true,
		},
		{
			"Email already exists",
			"UserFree",
			"password",
			"emailexists@hotmail.com",
			true,
		},
		{
			"User and Email exists",
			"UserExists",
			"password",
			"emailexists@hotmail.com",
			true,
		},
		{
			"neither the user nor the email exists",
			"Usertest1",
			"password",
			"correct@hotmail.com",
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := app.DoRegister(tt.user, tt.email, tt.password)
			if tt.expectErr {
				assert.Error(err, "Expected an error!")
			} else {
				assert.NoErrorf(err, "Expected no error! %v", err)
			}
		})
	}
}

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

func Test_Logout(t *testing.T) {
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
		expectErr bool
		checkData bool
	}{
		{
			"correct logout",
			userTest,
			false,
			false,
		},
		{
			"incorrect logout",
			"",
			true,
			false,
		},
		{
			"correct logout data checked",
			userTest,
			false,
			true,
		},
		{
			"incorrect logout data checked",
			"",
			true,
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app.DoLogin(userTest, passTest)

			err := app.DoLogout(tt.user)
			if tt.expectErr {
				assert.NotNil(err, "should to be a error result")
				if tt.checkData {
					sessionByte, err := app.GetLastSession()
					assert.Nil(err)

					var session models.LastSession
					json.Unmarshal([]byte(sessionByte), &session)

					assert.NotEmpty(session.Token)
					assert.NotEmpty(session.UserKey)
					assert.NotEmpty(session.Username)

				}
			} else {
				assert.Nil(err, "should to be a nil result")
				if tt.checkData {
					sessionByte, _ := app.GetLastSession()
					// assert.NotNil(err)
					var session models.LastSession
					json.Unmarshal([]byte(sessionByte), &session)

					assert.Empty(session.Token)
					assert.Empty(session.UserKey)
					assert.Empty(session.Username)
				}
			}

			// again login for the next test
		})
	}

}
