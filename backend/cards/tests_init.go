package cards

import (
	"GoPass/backend/auth"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/test"
	"math/rand"
	"testing"
	"time"

	"go.etcd.io/bbolt"
)

func initTest() (*bbolt.DB, request.Login, func()) {
	var t *testing.T
	db, cleanup := test.CreateTestDB()

	// Register process
	rRegister := request.Register{
		Account:  "flussen",
		Email:    "mail@hotmail.com",
		Password: "admGn",
		Configs:  models.Config{},
	}

	_, err := auth.Register(db, rRegister.Account, rRegister.Email,
		rRegister.Password, rRegister.Configs)
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}

	// Login process
	rLogin := request.Login{
		Account:  "flussen",
		Password: "admin",
	}

	_, err = auth.Login(db, rLogin.Account, rLogin.Password)
	if err != nil {
		t.Fatalf("Login failed: %v", err)
	}

	card1 := request.Card{
		Card:         "Visa",
		Holder:       "John Doe",
		Number:       5916570579466262,
		SecurityCode: 179,
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
	}

	_, err = NewCard(db, rLogin.Account, card1)
	if err != nil {
		t.Fatal(err)
	}
	_, err = NewCard(db, rLogin.Account, card2)
	if err != nil {
		t.Fatal(err)
	}

	return db, rLogin, cleanup
}
