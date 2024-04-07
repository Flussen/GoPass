package profile

import (
	"GoPass/backend/models"
	"testing"

	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

func TestGetAccountInfo(t *testing.T) {
	db, account, cleanup := InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	tests := []struct {
		name        string
		account     string
		expectError bool
	}{
		{
			name:        "get account info successfully",
			account:     account.Account,
			expectError: false,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			expectError: true,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			user, err := GetAccountInfo(db, tt.account)

			if tt.expectError {
				assert.Error(err)
				assert.Equal(models.User{}, user)
			} else {
				assert.NoError(err)
				assert.NotEqual(models.User{}, user)
				assert.Equal(tt.account, user.Account)
			}
		})
	}
}

func TestGetUsersConcurrently(t *testing.T) {
	db, _, cleanup := InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	users, err := GetUsersConcurrently(db)

	if assert.NoError(err, "No error should occur when fetching users concurrently") {
		assert.NotEmpty(users, "Users should be retrieved")
		for _, user := range users {
			assert.NotEmpty(user.ID, "Each user should have an ID")
			assert.Empty(user.Password, "Password should be cleared out in the retrieved user data")
		}
	}
}

func TestUpdateProfile(t *testing.T) {
	db, account, cleanup := InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	newModel := models.UserRequest{
		Account: "updatedAccount",
		Email:   "updated@example.com",
		Config: models.Config{
			Groups: []string{"group1", "group2"},
			UI:     "updatedUI",
		},
	}

	tests := []struct {
		name        string
		account     string
		newModel    models.UserRequest
		expectError bool
	}{
		{
			name:        "update profile successfully",
			account:     account.Account,
			newModel:    newModel,
			expectError: false,
		},
		{
			name:        "empty account parameter",
			account:     "",
			newModel:    newModel,
			expectError: true,
		},
		{
			name:    "empty new model fields",
			account: account.Account,
			newModel: models.UserRequest{
				Account: "",
				Email:   "",
				Config:  models.Config{},
			},
			expectError: true,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			newModel:    newModel,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := UpdateProfile(db, tt.account, tt.newModel)

			if tt.expectError {
				assert.Error(err)
			} else {
				assert.NoError(err)
				updatedUser, err := GetAccountInfo(db, tt.account)
				assert.NoError(err)
				assert.Equal(tt.newModel.Account, updatedUser.Account)
				assert.Equal(tt.newModel.Email, updatedUser.Email)
				assert.Equal(tt.newModel.Config.Groups, updatedUser.Config.Groups)
				assert.Equal(tt.newModel.Config.UI, updatedUser.Config.UI)
			}
		})
	}
}

func TestChangeAccountPassword(t *testing.T) {
	db, account, cleanup := InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	// Account:  "flussen",
	// Email:    "mail@hotmail.com",
	// Password: "admGn",

	originalPwd := account.Password
	newPwd := "newPassword"

	tests := []struct {
		name        string
		account     string
		originalPwd string
		newPwd      string
		expectError bool
	}{
		{
			name:        "change password successfully",
			account:     account.Account,
			originalPwd: originalPwd,
			newPwd:      newPwd,
			expectError: false,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			originalPwd: originalPwd,
			newPwd:      newPwd,
			expectError: true,
		},
		{
			name:        "incorrect original password",
			account:     account.Account,
			originalPwd: "wrongPassword",
			newPwd:      newPwd,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ChangeAccountPassword(db, tt.account, tt.originalPwd, tt.newPwd)

			if tt.expectError {
				assert.Error(err)
			} else {
				assert.NoError(err)

				updatedUser, err := GetAccountInfo(db, tt.account)
				assert.NoError(err)
				err = bcrypt.CompareHashAndPassword([]byte(updatedUser.Password), []byte(tt.newPwd))
				assert.NoError(err)
			}
		})
	}
}
