package profile

import (
	"GoPass/backend/models"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAccountInfo(t *testing.T) {
	db, account, cleanup := initTestProfile()
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
		t.Run(tt.name, func(t *testing.T) {
			user, err := GetAccounInfo(db, tt.account)

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
