package actions

import (
	"GoPass/backend/auth"
	"GoPass/backend/credentials/cards"
	"GoPass/backend/credentials/passwords"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/test"
	"math/rand"
	"time"

	"go.etcd.io/bbolt"
)

func initTest() (*bbolt.DB, request.Register, func()) {
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
		panic(err)
	}

	rspL, err := auth.Login(db, rRegister.Account, rRegister.Password)
	if err != nil {
		panic(err)
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

	_, err = cards.NewCard(db, rRegister.Account, card1)
	if err != nil {
		panic(err)
	}
	_, err = cards.NewCard(db, rRegister.Account, card2)
	if err != nil {
		panic(err)
	}

	_, _ = passwords.NewPassword(db, rRegister.Account, rspL.UserKey, request.Password{
		Title:    "Get Password Test",
		Username: "tester",
		Pwd:      "testpassword",
		Settings: models.Settings{Favorite: true, Icon: "default", Status: "active"},
	})

	_, _ = passwords.NewPassword(db, rRegister.Account, rspL.UserKey, request.Password{
		Title:    "Password",
		Username: "test1",
		Pwd:      "xdd",
		Settings: models.Settings{Favorite: true},
	})

	return db, rRegister, cleanup
}
