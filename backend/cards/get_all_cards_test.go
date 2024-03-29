package cards

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetAllCards(t *testing.T) {
	assert := assert.New(t)
	db, rLogin, cleanup := initTest()
	defer cleanup()

	tests := []struct {
		name      string
		expectErr bool
	}{
		{
			"all passwords were obtained",
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cards, err := GetAllCards(db, rLogin.Account)

			if tt.expectErr {
				assert.NotNil(err)
				assert.Nil(cards)
			} else {
				assert.NotNil(cards)
				assert.Nil(err)
			}
		})
	}
}
