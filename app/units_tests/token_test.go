package units_tests

import (
	"GoPass/app"
	"GoPass/backend/controllers"
	"GoPass/backend/models"
	"encoding/json"
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_token_verification(t *testing.T) {
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
	var userdata models.Receive

	err = json.Unmarshal([]byte(js), &userdata)
	if err != nil {
		t.Fatalf("json.Unmarshal failed: %v", err)
	}

	tests := []struct {
		name        string
		tuser       string
		ttoken      string
		expectErr   bool
		invalidDate bool
		expectValid bool
	}{
		{
			"correct token",
			userTest,
			userdata.Token,
			false,
			false,
			true,
		},
		{
			"incorrect token",
			userTest,
			"a1bd-123B-asd1-hggf-b443-sdfg",
			true,
			false,
			false,
		},
		{
			"invalid date",
			userTest,
			userdata.Token,
			false,
			true,
			false,
		},
		{
			"expect err for invalid user",
			"FakeUser",
			userdata.Token,
			true,
			false,
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.invalidDate {
				newTime := time.Date(2024, time.January, 1, 21, 0, 0, 0, time.UTC).Format(time.RFC3339)

				data, err := app.GetUserInfo(tt.tuser)
				if err != nil {
					t.Fatal(err)
				}

				var dataUser models.User
				if err := json.Unmarshal([]byte(data), &dataUser); err != nil {
					t.Fatal(err)
				}

				dataUser.TokenExpiry = newTime
				if err = controllers.UpdateUser(db, tt.tuser, dataUser); err != nil {
					t.Fatalf("UpdateUser failed: %v", err)
				}
			}

			validation, err := app.GetTokenVerification(tt.tuser, tt.ttoken)

			if tt.expectValid {
				assert.True(validation)
			} else {
				assert.False(validation)
			}

			if tt.expectErr {
				assert.NotNil(err)
				fmt.Printf("ERROR: %v\n", err)
				assert.False(validation)
			} else {
				assert.Nil(err)
			}
		})
	}
}
