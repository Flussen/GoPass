package groups

import (
	"GoPass/backend/auth"
	"GoPass/backend/credentials/passwords"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/profile"
	"log"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewGroup(t *testing.T) {
	db, account, _, cleanup := profile.InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	tests := []struct {
		name        string
		account     string
		groups      []string
		expectError bool
	}{
		{
			name:        "successful group addition",
			account:     account.Account,
			groups:      []string{"group1", "group2"},
			expectError: false,
		},
		{
			name:        "empty account",
			account:     "",
			groups:      []string{"group1"},
			expectError: true,
		},
		{
			name:        "nil groups",
			account:     account.Account,
			groups:      nil,
			expectError: true,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			groups:      []string{"group1"},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := NewGroup(db, tt.account, tt.groups)

			if tt.expectError {
				assert.Error(err)
			} else {
				assert.NoError(err)

				user, err := profile.GetAccountInfo(db, tt.account)
				assert.NoError(err)

				assert.Equal(tt.groups, user.Config.Groups)
			}
		})
	}
}

func TestDeleteGroup(t *testing.T) {
	db, account, _, cleanup := profile.InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	err := NewGroup(db, account.Account, []string{"group1", "group2"})
	assert.NoError(err)

	tests := []struct {
		name        string
		account     string
		group       string
		expectError bool
	}{
		{
			name:        "successful group deletion",
			account:     account.Account,
			group:       "group1",
			expectError: false,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			group:       "group1",
			expectError: true,
		},
		{
			name:        "non-existent group",
			account:     account.Account,
			group:       "nonexistentgroup",
			expectError: false,
		},
		{
			name:        "empty account",
			account:     "",
			group:       "group1",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := DeleteGroup(db, tt.account, tt.group)

			if tt.expectError {
				assert.Error(err)
			} else {
				assert.NoError(err)

				user, err := profile.GetAccountInfo(db, tt.account)
				assert.NoError(err)
				assert.Len(user.Config.Groups, 1)

				var groupFound bool
				for _, g := range user.Config.Groups {
					if g == tt.group {
						groupFound = true
						break
					}
				}

				assert.False(groupFound, "The group should have been deleted")
			}
		})
	}
}

func TestGetGroups(t *testing.T) {
	db, account, _, cleanup := profile.InitTestProfile()
	defer cleanup()

	assert := assert.New(t)

	err := NewGroup(db, account.Account, []string{"group1"})
	assert.NoError(err)

	tests := []struct {
		name        string
		account     string
		expectError bool
		expectCount int
	}{
		{
			name:        "get groups successfully",
			account:     account.Account,
			expectError: false,
			expectCount: 2,
		},
		{
			name:        "non-existent account",
			account:     "nonexistent",
			expectError: true,
			expectCount: 0,
		},
		{
			name:        "account with no groups",
			account:     "accounttest2", // account added in init tests
			expectError: true,
			expectCount: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			groups, err := GetGroups(db, tt.account)

			if tt.expectError {
				assert.Error(err)
				assert.Nil(groups)
			} else {
				assert.NoError(err)
				assert.NotNil(groups)
				assert.Len(groups, tt.expectCount)
			}
		})
	}
}

func TestGetAllCredentialsByGroup(t *testing.T) {
	db, account, rspL, cleanup := profile.InitTestProfile()
	defer cleanup()
	c := assert.New(t)

	_, err := auth.Register(db, "account_to_test", "mailtest@mail.com",
		"testpassword", models.Config{})
	c.NoError(err)

	passwords.NewPassword(db, account.Account, rspL.UserKey, request.Password{
		Title:    "passwords",
		Username: "xd",
		Pwd:      "test",
		Settings: models.Settings{},
	})

	passwords.NewPassword(db, account.Account, rspL.UserKey, request.Password{
		Title:    "password2",
		Username: "asd",
		Pwd:      "as",
		Settings: models.Settings{Group: "google"},
	})

	passwords.NewPassword(db, account.Account, rspL.UserKey, request.Password{
		Title:    "password3",
		Username: "asd3",
		Pwd:      "as3",
		Settings: models.Settings{Group: "secured"},
	})

	tests := []struct {
		name      string
		account   string
		expectErr bool
	}{
		{
			name:      "passed test",
			account:   account.Account,
			expectErr: false,
		},
		{
			name:      "fail account",
			account:   "fakeaccount",
			expectErr: true,
		},
		{
			name:      "none of the parameters can be empty.",
			account:   "",
			expectErr: true,
		},
		{
			name:      "the account don't have passwords",
			account:   "account_to_test",
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			groupsMap, err := GetAllCredentialsByGroup(db, tt.account)
			if tt.expectErr {
				c.Error(err)
				c.Nil(groupsMap)
			} else {
				c.NoError(err)
				c.NotNil(groupsMap)
				log.Println(groupsMap)
			}
		})
	}
}
