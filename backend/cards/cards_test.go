package cards

import (
	eh "GoPass/backend/errorHandler"
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

func TestGetAllCards(t *testing.T) {
	assert := assert.New(t)
	db, rLogin, cleanup := initTest()
	defer cleanup()

	tests := []struct {
		name      string
		account   string
		expectErr bool
	}{
		{
			"all passwords were obtained",
			rLogin.Account,
			false,
		},
		{
			"test fail",
			"imNotA_user",
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cards, err := GetAllCards(db, tt.account)

			log.Println(err)

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

func TestGetCardByID(t *testing.T) {
	assert := assert.New(t)
	db, rLogin, cleanup := initTest()
	defer cleanup()

	id, _ := NewCard(db, rLogin.Account, request.Card{
		Card:         "Mastercard",
		Holder:       "John Doe",
		Number:       5216570769466262,
		SecurityCode: 179,
		Month:        rand.Intn(12) + 1,
		Year:         1 + time.Now().Year(),
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "default",
			Status:   "secured",
		},
	})

	tests := []struct {
		name      string
		account   string
		id        string
		expectErr bool
	}{
		{
			"get passed",
			rLogin.Account,
			id,
			false,
		},
		{
			"test fail 1",
			rLogin.Account,
			"iamnotaid",
			true,
		},
		{
			"test fail 2",
			"iamnotauser",
			id,
			true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			card, err := GetCardById(db, tt.account, tt.id)

			log.Println(err)

			if tt.expectErr {
				assert.NotNil(err)
				if err != eh.ErrNotFound {
					t.Fatal("It didn't turn out to be a programmed error.")
				}
				assert.Empty(card)
			} else {
				assert.NotEmpty(card)
				assert.Nil(err)
				assert.Equal(card.ID, id)
			}
		})
	}
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

func TestUpdateCard(t *testing.T) {
	assert := assert.New(t)
	db, rLogin, cleanup := initTest()
	defer cleanup()

	id, _ := NewCard(db, rLogin.Account, request.Card{
		Card:         "Mastercard",
		Holder:       "John Doe",
		Number:       5216570769466262,
		SecurityCode: 179,
		Month:        rand.Intn(12) + 1,
		Year:         1 + time.Now().Year(),
		Settings: models.Settings{
			Favorite: true,
			Group:    "visas",
			Icon:     "default",
			Status:   "secured",
		},
	})

	tests := []struct {
		name      string
		account   string
		id        string
		card      request.Card
		expectErr bool
	}{
		{
			"fail update (the card number is less than 16)",
			rLogin.Account,
			id,
			request.Card{
				Card:         "American Express",
				Holder:       "John Doe",
				Number:       generateRandomNumber(12),
				SecurityCode: generateRandomNumber(3),
				Month:        rand.Intn(12) + 1,
				Year:         1 + time.Now().Year(),
				Settings: models.Settings{
					Favorite: true,
					Group:    "visas",
					Icon:     "default",
					Status:   "secured",
				},
			},
			true,
		},
		{
			"fail update (the security number is less than 3)",
			rLogin.Account,
			id,
			request.Card{
				Card:         "Discover",
				Holder:       "John Doe",
				Number:       generateRandomNumber(16),
				SecurityCode: generateRandomNumber(2),
				Month:        rand.Intn(12) + 1,
				Year:         1 + time.Now().Year(),
				Settings: models.Settings{
					Favorite: true,
					Group:    "visas",
					Icon:     "default",
					Status:   "secured",
				},
			},
			true,
		},
		{
			"fail update (invalid date)",
			rLogin.Account,
			id,
			request.Card{
				Card:         "Santander",
				Holder:       "John Doe",
				Number:       generateRandomNumber(16),
				SecurityCode: generateRandomNumber(3),
				Month:        13,
				Year:         time.Now().Year() + 11,
				Settings: models.Settings{
					Favorite: true,
					Group:    "visas",
					Icon:     "default",
					Status:   "secured",
				},
			},
			true,
		},
		{
			"fail update not found",
			"iamnotuser",
			id,
			request.Card{
				Card:         "Union pay",
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
			},
			true,
		},
		{
			"updated passed",
			rLogin.Account,
			id,
			request.Card{
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
			},
			false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := UpdateCard(db, tt.account, tt.id, tt.card)

			log.Println(err)

			if tt.expectErr {
				assert.NotNil(err)

				card, err := GetCardById(db, rLogin.Account, id)
				if err != nil {
					if err == eh.ErrNotFound {
						log.Println(err)
					} else {
						t.Fatal(err)
					}
				}

				assert.Equal("Mastercard", card.Card)
			} else {
				assert.Nil(err)

				card, err := GetCardById(db, rLogin.Account, id)
				if err != nil {
					t.Fatal(err)
				}

				assert.Equal("Visa", card.Card)

				fmt.Println(card)
			}
		})
	}
}
