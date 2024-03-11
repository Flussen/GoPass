package units_tests

import (
	"GoPass/app"
	"testing"

	"github.com/stretchr/testify/assert"
)

// TestDoRegister verifies the functionality of the DoRegister method in the App struct.
// It creates a test database, initializes the App instance with the test database,
// and then attempts to register a user using the DoRegister method.
// If an error occurs during the registration process, the test fails with a fatal error message.
// If the registration process is not successful, the test also fails with a fatal error message.

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
				assert.NoErrorf(err, "Expected no error! %v", err)
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
