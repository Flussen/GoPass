package groups

import (
	"GoPass/backend/credentials/passwords"
	database "GoPass/backend/db"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"encoding/json"
	"log"
	"sync"

	"go.etcd.io/bbolt"
)

func NewGroup(db *bbolt.DB, account string, groups []string) error {
	if account == "" || groups == nil {
		return eh.ErrEmptyParameter
	}

	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("bucket not found")
			return eh.ErrInternalServer
		}

		accountByte := bucket.Get([]byte(account))
		if accountByte == nil {
			return eh.ErrNotFound
		}

		var user models.User
		err := json.Unmarshal(accountByte, &user)
		if err != nil {
			log.Println("ERROR:", err)
			return err
		}

		user.Config.Groups = append(user.Config.Groups, groups...)

		userByte, err := json.Marshal(user)
		if err != nil {
			log.Println("ERROR:", err)
			return err
		}

		if err = bucket.Put([]byte(account), userByte); err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}
		return nil
	})
}

func DeleteGroup(db *bbolt.DB, account, group string) error {
	return db.Update(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("bucket not found")
			return eh.ErrInternalServer
		}

		userByte := bucket.Get([]byte(account))
		if userByte == nil {
			log.Println("user not found")
			return eh.ErrNotFound
		}

		var user models.User

		err := json.Unmarshal(userByte, &user)
		if err != nil {
			log.Println("error in unmarshal:", err)
			return eh.ErrInternalServer
		}

		filteredGroups := []string{}
		for _, v := range user.Config.Groups {
			if v != group {
				filteredGroups = append(filteredGroups, v)
			}
		}
		user.Config.Groups = filteredGroups

		updatedUserByte, err := json.Marshal(user)
		if err != nil {
			log.Println("error in marshal:", err)
			return eh.ErrInternalServer
		}

		err = bucket.Put([]byte(account), updatedUserByte)
		if err != nil {
			log.Println("error in saving user:", err)
			return eh.ErrInternalServer
		}

		return nil
	})
}

func GetGroups(db *bbolt.DB, account string) ([]string, error) {
	var groups []string
	err := db.View(func(tx *bbolt.Tx) error {
		bucket := tx.Bucket([]byte(database.BucketUsers))
		if bucket == nil {
			log.Println("bucket not found")
			return eh.ErrInternalServer
		}

		userByte := bucket.Get([]byte(account))
		if userByte == nil {
			return eh.ErrNotFound
		}
		var user models.User
		if err := json.Unmarshal(userByte, &user); err != nil {
			log.Println("error in unmarshal:", err)
			return eh.ErrInternalServer
		}

		groups = append(groups, user.Config.Groups...)

		return nil
	})
	if err != nil {
		log.Println("ERROR:", err)

		return nil, eh.ErrInternalServer
	}

	if groups == nil {
		return nil, eh.NewGoPassError("apparently there are no groups in this user")
	}
	return groups, nil
}

func GetAllCredentialsByGroup(db *bbolt.DB, account string, groups []string) (map[string][]models.Password, error) {

	if groups == nil || account == "" {
		return nil, eh.ErrEmptyParameter
	}

	groupsMapped := make(map[string][]models.Password)
	mutex := &sync.Mutex{}
	passwords, err := passwords.GetAllPasswords(db, account)
	if err != nil {
		return nil, err
	}

	_, err = GetGroups(db, account)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	for _, group := range groups {
		wg.Add(1)
		go func(group string) {
			defer wg.Done()
			for _, password := range passwords {
				if password.Settings.Group == group {
					mutex.Lock()
					groupsMapped[group] = append(groupsMapped[group], password)
					mutex.Unlock()
				}
			}
		}(group)
	}
	wg.Wait()

	for _, group := range groups {
		if groupsMapped[group] == nil {
			return nil, eh.NewGoPassError("1 - no group corresponds to the user's groups")
		}
	}

	if groupsMapped == nil {
		return nil, eh.NewGoPassError("2 - no group corresponds to the user's groups")
	}

	return groupsMapped, nil
}
