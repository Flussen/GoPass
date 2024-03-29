package units_tests

import (
	"GoPass/app"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"log"
	"math/rand"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func generateRandomNumber(n int) uint {
	min := uint(1)
	max := uint(10)
	for i := 1; i < n; i++ {
		max *= 10
	}
	return min + uint(rand.Intn(int(max-min)))
}

func TestNewCard(t *testing.T) {
	assert := assert.New(t)
	db, cleanup := CreateTestDB()
	defer cleanup()

	app := &app.App{DB: db}

	// Register process
	rRegister := request.Register{
		Account:  "flussen",
		Email:    "mail@hotmail.com",
		Password: "admin",
		Configs:  models.Config{},
	}

	_, err := app.DoRegister(rRegister)
	if err != nil {
		t.Fatalf("DoRegister failed: %v", err)
	}

	// Login process
	rLogin := request.Login{
		Account:  "flussen",
		Password: "admin",
	}

	_, err = app.DoLogin(rLogin)
	if err != nil {
		t.Fatalf("DoLogin failed: %v", err)
	}

	card1 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       generateRandomNumber(16),
		SecurityCode: generateRandomNumber(3),
		Month:        rand.Intn(12) + 1,
		Year:         rand.Intn(10) + time.Now().Year(), // Año actual más un número aleatorio entre 0 y 9
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "visa",
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
			rRegister.Account,
			card1,
			false,
		},
		{
			"fail new card (number length)",
			rRegister.Account,
			card2,
			true,
		},
		{
			"fail new card (security length)",
			rRegister.Account,
			card3,
			true,
		},
		{
			"fail new card expired",
			rRegister.Account,
			card4,
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id, err := app.DoNewCard(tt.account, tt.card)

			log.Println(err)

			if tt.expectErr {
				assert.NotNil(err)
				assert.Empty(id)
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
