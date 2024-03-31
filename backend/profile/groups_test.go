package profile

import (
	"GoPass/backend/controllers"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAsd(t *testing.T) {
	db, account, cleanup := initTestProfile()
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

				user, err := controllers.GetUserInfo(db, tt.account)
				assert.NoError(err)

				assert.Equal(tt.groups, user.Config.Groups)
			}
		})
	}
}
