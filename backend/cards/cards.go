package cards

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func NewCard(db *bbolt.DB, account string, request request.Card) (string, error) {

	if request.Card == "" {
		return "", eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	cardExpiry := time.Date(request.Year, time.Month(request.Month), 1, 0, 0, 0, 0, time.UTC)

	if time.Now().Before(cardExpiry) {
		return "", eh.NewGoPassError("card is maybe expired")
	}

	newCard := models.Card{
		ID:           uuid.New().String(),
		Card:         request.Card,
		Holder:       request.Holder,
		Number:       request.Number,
		Expiry:       cardExpiry,
		SecurityCode: request.SecurityCode,
		Settings:     request.Settings,
	}

	cardByte, err := json.Marshal(newCard)
	if err != nil {
		return "", err
	}

	keyName := fmt.Sprintf("%s:%s", account, newCard.ID)

	err = db.Update(func(tx *bbolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists([]byte("cards"))
		if err != nil {
			return err
		}

		return bucket.Put([]byte(keyName), cardByte)
	})

	if err != nil {
		return "", err
	}
	return newCard.ID, nil
}
