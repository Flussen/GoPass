package passwords

import (
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewPassword(t *testing.T) {
	db, rspL, rqstR, cleanup := initTestPassword()
	defer cleanup()

	assert := assert.New(t)

	tests := []struct {
		name        string
		account     string
		userKey     string
		request     request.Password
		expectError bool
	}{
		{
			name:    "create valid password",
			account: rqstR.Account,
			userKey: rspL.UserKey,
			request: request.Password{
				Title:    "Test Password",
				Username: "testuser",
				Pwd:      "strongpassword",
				Settings: models.Settings{Favorite: true, Icon: "default", Status: "active"},
			},
			expectError: false,
		},
		{
			name:        "fail empty account",
			account:     "",
			userKey:     rspL.UserKey,
			request:     request.Password{},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id, err := NewPassword(db, tt.account, tt.userKey, tt.request)

			if tt.expectError {
				assert.Error(err)
				assert.Empty(id)
				log.Println(err)
			} else {
				assert.NoError(err)
				assert.NotEmpty(id)

				if password, err := GetPasswordByID(db, tt.account, id); err != nil {
					t.Fatal(err)
				} else {
					assert.NotEqualValues(password, models.Password{})
				}
			}
		})
	}
}

func TestGetPasswordByID(t *testing.T) {
	db, rspL, rqstR, cleanup := initTestPassword()
	defer cleanup()

	assert := assert.New(t)

	passwordID, err := NewPassword(db, rqstR.Account, rspL.UserKey, request.Password{
		Title:    "Get Password Test",
		Username: "tester",
		Pwd:      "testpassword",
		Settings: models.Settings{Favorite: true, Icon: "default", Status: "active"},
	})
	assert.NoError(err)

	tests := []struct {
		name        string
		account     string
		id          string
		expectError bool
	}{
		{
			name:        "get password by valid ID",
			account:     rqstR.Account,
			id:          passwordID,
			expectError: false,
		},
		{
			name:        "get password by invalid ID",
			account:     rqstR.Account,
			id:          "nonexistent",
			expectError: true,
		},
		{
			name:        "get password by invalid account",
			account:     "invalidAccount",
			id:          passwordID,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			password, err := GetPasswordByID(db, tt.account, tt.id)

			if tt.expectError {
				assert.Error(err)
				assert.Empty(password)
				log.Println(err)
			} else {
				assert.NoError(err)
				assert.NotEmpty(password)
				assert.Equal(passwordID, password.ID)
			}
		})
	}
}

func TestGetAllPasswords(t *testing.T) {
	db, rspL, rqstR, cleanup := initTestPassword()
	defer cleanup()

	assert := assert.New(t)

	_, err := NewPassword(db, rqstR.Account, rspL.UserKey, request.Password{
		Title:    "Get Password Test",
		Username: "tester",
		Pwd:      "testpassword",
		Settings: models.Settings{Favorite: true, Icon: "default", Status: "active"},
	})
	assert.NoError(err)

	_, err = NewPassword(db, rqstR.Account, rspL.UserKey, request.Password{
		Title:    "Get Password Test 2",
		Username: "testing",
		Pwd:      "password test",
		Settings: models.Settings{Icon: "default"},
	})
	assert.NoError(err)

	tests := []struct {
		name        string
		account     string
		expectError bool
	}{
		{
			name:        "get all passwords successfully",
			account:     rqstR.Account,
			expectError: false,
		},
		{
			name:        "get all passwords with no results",
			account:     "nonexistent",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			passwords, err := GetAllPasswords(db, tt.account)

			if tt.expectError {
				assert.Error(err)
				assert.Nil(passwords)
				log.Println(err)
			} else {
				assert.NoError(err)
				assert.NotNil(passwords)
				assert.NotEmpty(passwords)
			}
		})
	}
}

func TestUpdatePassword(t *testing.T) {
	db, rspL, rqstR, cleanup := initTestPassword()
	defer cleanup()

	assert := assert.New(t)

	initialPasswordRequest := request.Password{
		Title:    "Initial Title",
		Username: "initialUser",
		Pwd:      "initialPwd",
		Settings: models.Settings{Favorite: true, Icon: "default", Status: "active"},
	}
	passwordID, err := NewPassword(db, rqstR.Account, rspL.UserKey, initialPasswordRequest)
	assert.NoError(err)

	tests := []struct {
		name        string
		account     string
		id          string
		userKey     string
		request     request.Password
		expectError bool
	}{
		{
			name:    "successful update",
			account: rqstR.Account,
			id:      passwordID,
			userKey: rspL.UserKey,
			request: request.Password{
				Title:    "Updated Title",
				Username: "updatedUser",
				Pwd:      "updatedPwd",
			},
			expectError: false,
		},
		{
			name:        "update with empty fields",
			account:     "",
			id:          passwordID,
			userKey:     "",
			request:     request.Password{},
			expectError: true,
		},
		{
			name:    "update with invalid userKey",
			account: rqstR.Account,
			id:      passwordID,
			userKey: "wrongUserKey",
			request: request.Password{
				Title:    "Updated Title",
				Username: "updatedUser",
				Pwd:      "updatedPwd",
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := UpdatePassword(db, tt.account, tt.id, tt.userKey, tt.request)

			if tt.expectError {
				assert.Error(err)
				log.Println(err)
			} else {
				assert.NoError(err)

				updatedPassword, err := GetPasswordByID(db, tt.account, tt.id)
				assert.NoError(err)
				assert.Equal(tt.request.Title, updatedPassword.Title)
				assert.Equal(tt.request.Username, updatedPassword.Username)
			}
		})
	}
}
