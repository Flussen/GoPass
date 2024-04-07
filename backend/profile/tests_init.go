package profile

import (
	"GoPass/backend/auth"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/response"
	"GoPass/backend/pkg/test"

	"go.etcd.io/bbolt"
)

func InitTestProfile() (*bbolt.DB, request.Register, response.Login, func()) {
	db, cleanup := test.CreateTestDB()
	groups := []string{"secured", "google"}
	// Register process
	rRegister := request.Register{
		Account:  "flussen",
		Email:    "mail@hotmail.com",
		Password: "admGn",
		Configs:  models.Config{Groups: groups},
	}

	_, err := auth.Register(db, rRegister.Account, rRegister.Email,
		rRegister.Password, rRegister.Configs)
	if err != nil {
		panic(err)
	}

	_, err = auth.Register(db, "accounttest2", "mailtest@mail.com",
		rRegister.Password, rRegister.Configs)
	if err != nil {
		panic(err)
	}

	rspL, err := auth.Login(db, rRegister.Account, rRegister.Password)
	if err != nil {
		panic(err)
	}

	return db, rRegister, rspL, cleanup
}
