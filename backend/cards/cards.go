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

func NewCard(db *bbolt.DB, account string, rqst request.Card) (string, error) {

	if rqst == (request.Card{}) {
		return "", eh.NewGoPassError(eh.ErrEmptyParameters)
	}

	cardExpiry := time.Date(rqst.Year, time.Month(rqst.Month), 1, 0, 0, 0, 0, time.UTC)

	if !time.Now().Before(cardExpiry) {
		return "", eh.NewGoPassError("card is maybe expired")
	}

	if len(strconv.FormatUint(uint64(rqst.Number), 10)) < 16 {
		return "", eh.NewGoPassError("the card number cannot be less than 16")
	}

	if len(strconv.FormatUint(uint64(rqst.SecurityCode), 10)) < 3 {
		return "", eh.NewGoPassError("the securiy number cannot be less than 3")
	}

	if rqst.Year > time.Now().Year()+10 {
		return "", eh.NewGoPassError("maybe it is not a valid expiration time")
	}

	if rqst.Month > 12 || rqst.Month <= 0 {
		return "", eh.NewGoPassError("maybe it is not a valid expiration time")
	}

	newCard := models.Card{
		ID:           uuid.New().String(),
		Card:         rqst.Card,
		Holder:       rqst.Holder,
		Number:       rqst.Number,
		Expiry:       cardExpiry,
		SecurityCode: rqst.SecurityCode,
		Settings:     rqst.Settings,
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

	if cards == nil {
		return nil, eh.ErrNotFound
	}

	return cards, err
}

func GetCardById(db *bbolt.DB, account, id string) (models.Card, error) {

	if account == "" || id == "" {
		return models.Card{}, eh.ErrEmptyParameter
	}

	var card models.Card

	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketCards))

		keyuuid := fmt.Sprintf("%s:%s", account, id)
		cardByte := bucket.Get([]byte(keyuuid))
		if cardByte == nil {
			return eh.ErrNotFound
		}

		err := json.Unmarshal(cardByte, &card)
		if err != nil {
			return eh.ErrInternalServer
		}
		return nil
	})
	if err != nil {
		return models.Card{}, err
	}

	if card.ID == "" {
		return models.Card{}, eh.ErrNotFound
	}

	return card, nil
}

func UpdateCard(db *bbolt.DB, account, id string, rqst request.Card) error {
	if account == "" || rqst == (request.Card{}) {
		return eh.ErrEmptyParameter
	}

	keyName := fmt.Sprintf("%s:%s", account, id)

	cardExpiry := time.Date(rqst.Year, time.Month(rqst.Month), 1, 0, 0, 0, 0, time.UTC)

	if !time.Now().Before(cardExpiry) {
		return eh.NewGoPassError("card is maybe expired")
	}

	if len(strconv.FormatUint(uint64(rqst.Number), 10)) < 16 {
		return eh.NewGoPassError("the card number cannot be less than 16")
	}

	if len(strconv.FormatUint(uint64(rqst.SecurityCode), 10)) < 3 {
		return eh.NewGoPassError("the securiy number cannot be less than 3")
	}

	if rqst.Year > time.Now().Year()+10 {
		return eh.NewGoPassError("maybe it is not a valid expiration time")
	}

	if rqst.Month > 12 || rqst.Month <= 0 {
		return eh.NewGoPassError("maybe it is not a valid expiration time")
	}

	err := db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketCards))
		if bucket == nil {
			return eh.ErrInternalServer
		}

		cardOldByte := bucket.Get([]byte(keyName))

		if cardOldByte == nil {
			return eh.ErrNotFound
		}

		var oldCard models.Card
		err := json.Unmarshal(cardOldByte, &oldCard)
		if err != nil {
			return eh.ErrInternalServer
		}

		newCard := models.Card{
			ID:           oldCard.ID,
			Card:         rqst.Card,
			Holder:       rqst.Holder,
			Number:       rqst.Number,
			Expiry:       cardExpiry,
			SecurityCode: rqst.SecurityCode,
			Settings:     rqst.Settings,
		}

		newCardByte, err := json.Marshal(newCard)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		return bucket.Put([]byte(keyName), newCardByte)
	})
	if err != nil {
		log.Println(err)
		return eh.ErrInternalServer
	}

	return err
}
