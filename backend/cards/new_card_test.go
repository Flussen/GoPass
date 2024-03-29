package cards

import (
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"fmt"
	"log"
	"math"
	"math/rand"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func generateRandomNumber(n int) uint {
	min := uint(math.Pow10(n - 1)) // Mínimo número posible de n dígitos
	max := uint(math.Pow10(n) - 1) // Máximo número posible de n dígitos
	return min + uint(rand.Intn(int(max-min)))
}

func TestNewCard(t *testing.T) {
	assert := assert.New(t)
	db, rLogin, cleanup := initTest()
	defer cleanup()

	card1 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       generateRandomNumber(16),
		SecurityCode: generateRandomNumber(3),
		Month:        rand.Intn(12) + 1,
		Year:         1 + time.Now().Year(),
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "default",
			Status:   "secured",
		},
	}

	card2 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       generateRandomNumber(13),
		SecurityCode: generateRandomNumber(3),
		Month:        rand.Intn(12) + 1,
		Year:         rand.Intn(10) + time.Now().Year(),
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "visa",
			Status:   "secured",
		},
	}

	card3 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       generateRandomNumber(16),
		SecurityCode: generateRandomNumber(2),
		Month:        rand.Intn(12) + 1,
		Year:         rand.Intn(10) + time.Now().Year(),
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "visa",
			Status:   "secured",
		},
	}

	card4 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       generateRandomNumber(16),
		SecurityCode: generateRandomNumber(3),
		Month:        rand.Intn(12) + 1,
		Year:         time.Now().Year() - 1,
		Settings: models.Settings{
			Favorite: true,
			Group:    "mastercard",
			Icon:     "masters",
			Status:   "",
		},
	}

	tests := []struct {
		name      string
		account   string
		card      request.Card
		expectErr bool
	}{
		{
			"create a new card",
			rLogin.Account,
			card1,
			false,
		},
		{
			"fail new card (number length)",
			rLogin.Account,
			card2,
			true,
		},
		{
			"fail new card (security length)",
			rLogin.Account,
			card3,
			true,
		},
		{
			"fail new card expired",
			rLogin.Account,
			card4,
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id, err := NewCard(db, tt.account, tt.card)

			log.Println(err)

			if tt.expectErr {
				assert.NotNil(err)
				assert.Empty(id)
				fmt.Println(tt.card)
			} else {
				assert.NotEmpty(id)
				assert.Nil(err)

				err := uuid.Validate(id)
				if err != nil {
					t.Error(err)
				}
			}
		})
	}
}
