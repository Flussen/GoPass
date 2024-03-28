package units_tests

import (
	"GoPass/backend/models"
	"fmt"
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestCards(t *testing.T) {

	account := "Busta"

	card1 := models.Card{
		ID:           uuid.New().String(),
		Card:         "test1",
		Holder:       "test",
		Number:       123,
		Expiry:       time.Now(),
		SecurityCode: 321,
		Settings:     models.Settings{},
	}

	keyName := fmt.Sprintf("%s:%s", account, card1.ID)
	fmt.Println(keyName)
}
