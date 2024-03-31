package auth

import (
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/response"
	"GoPass/backend/recovery"
	"time"

	"github.com/google/uuid"
	"go.etcd.io/bbolt"
)

func Register(db *bbolt.DB, account, email, password string, configs models.Config) (response.Register, error) {

	err := RegistryChecker(db, account, email, password)
	if err != nil {
		return response.Register{}, err
	}

	hashedPassword, UserKey, err := RegistrySecurer(password)
	if err != nil {
		return response.Register{}, err
	}

	newSeeds := recovery.GenerateSeedPhrase(15)

	newUser := models.User{
		ID:        uuid.New().String(),
		Account:   account,
		Email:     email,
		Password:  string(hashedPassword),
		Seeds:     newSeeds,
		UserKey:   UserKey,
		Config:    configs,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	if newUser.Seeds == nil {
		return response.Register{}, eh.ErrInternalServer
	}

	if err := CreateUser(db, newUser); err != nil {
		return response.Register{}, err
	}
	rsp := response.Register{
		ID:      newUser.ID,
		Account: newUser.Account,
		Seeds:   newUser.Seeds,
	}
	return rsp, nil
}
