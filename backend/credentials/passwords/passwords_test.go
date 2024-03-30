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
