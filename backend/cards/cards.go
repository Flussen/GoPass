package cards

import (
	database "GoPass/backend/db"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func NewCard(db *bbolt.DB, account string, request request.Card) (string, error) {

	if request.Card == "" {
		return "", eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	cardExpiry := time.Date(request.Year, time.Month(request.Month), 1, 0, 0, 0, 0, time.UTC)

	if !time.Now().Before(cardExpiry) {
		return "", eh.NewGoPassError("card is maybe expired")
	}

	if len(strconv.FormatUint(uint64(request.Number), 10)) < 16 {
		return "", eh.NewGoPassError("the card number cannot be less than 16")
	}

	if len(strconv.FormatUint(uint64(request.SecurityCode), 10)) < 3 {
		return "", eh.NewGoPassError("the securiy number cannot be less than 3")
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
		bucket, err := tx.CreateBucketIfNotExists([]byte(database.BucketCards))
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

func GetAllCards(db *bbolt.DB, account string) ([]models.Card, error) {
	var cards []models.Card

	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketCards))
		if bucket == nil {
			log.Println("ERROR: bucket not exist")
			return eh.ErrInternalServer
		}

		c := bucket.Cursor()
		prefix := []byte(fmt.Sprintf("%s:", account))

		for k, v := c.Seek(prefix); k != nil && strings.HasPrefix(string(k),
			string(prefix)); k, v = c.Next() {

			var card models.Card

			err := json.Unmarshal(v, &card)
			if err != nil {
				log.Println("ERROR:", err)
				return eh.ErrInternalServer
			}

			cards = append(cards, card)
		}
		return nil
	})
	if err != nil {
		log.Println("ERROR:", err)
		return nil, err
	}

	return cards, err
}
