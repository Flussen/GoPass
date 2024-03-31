package profile

import (
	"GoPass/backend/auth"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"GoPass/backend/pkg/test"

	"go.etcd.io/bbolt"
)

func initTestProfile() (*bbolt.DB, request.Register, func()) {
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

	_, err = auth.Login(db, rRegister.Account, rRegister.Password)
	if err != nil {
		panic(err)
	}

	return db, rRegister, cleanup
}
