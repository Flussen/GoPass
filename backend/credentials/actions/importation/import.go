package importation

import (
	database "GoPass/backend/db"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/models"
	"GoPass/backend/pkg/request"
	"encoding/base64"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"

	"go.etcd.io/bbolt"
)

func Import(db *bbolt.DB, rqst request.Import) error {
	parts := strings.Split(rqst.DataURL, ",")
	if len(parts) != 2 {
		return eh.NewGoPassError("invalid data URL")
	}

	decoded, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		log.Println(err)
		return eh.ErrInternalServer
	}

	switch rqst.FileType {
	case "csv":
		csvData, err := processCSV(decoded)
		if err != nil {
			log.Println("Error processing CSV:", err)
			return err
		}
		return processCSVData(db, rqst.Account, rqst.CredentialType, csvData)
	case "json":
		return processJSON(db, decoded, rqst.CredentialType, rqst.Account)
	default:
		return eh.NewGoPassError("file type not supported")
	}
}

func processJSON(db *bbolt.DB, data []byte, credentialType, account string) error {
	var err error

	switch credentialType {
	case "passwords":
		var dataToSave []models.Password
		err = json.Unmarshal(data, &dataToSave)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		return db.Update(func(tx *bbolt.Tx) error {
			bucket := tx.Bucket([]byte(database.BucketPassword))
			if bucket == nil {
				log.Println("passwords bucket is nil")
				return eh.ErrInternalServer
			}

			for _, password := range dataToSave {

				keyName := fmt.Sprintf("%s:%s", account, password.ID)
				passwordByte, err := json.Marshal(password)

				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}

				err = bucket.Put([]byte(keyName), passwordByte)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}
			}
			return nil
		})
	case "cards":
		var dataToSave []models.Card
		err = json.Unmarshal(data, &dataToSave)
		if err != nil {
			log.Println(err)
			return eh.ErrInternalServer
		}

		return db.Update(func(tx *bbolt.Tx) error {
			bucket := tx.Bucket([]byte(database.BucketCards))
			if bucket == nil {
				log.Println("cards bucket is nil")
				return eh.ErrInternalServer
			}

			for _, card := range dataToSave {

				keyName := fmt.Sprintf("%s:%s", account, card.ID)
				cardByte, err := json.Marshal(card)

				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}

				err = bucket.Put([]byte(keyName), cardByte)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}
			}
			return nil
		})
	default:
		return eh.NewGoPassError("unsupported credentials type")
	}
}

func processCSV(data []byte) ([]map[string]string, error) {
	reader := csv.NewReader(strings.NewReader(string(data)))
	records, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	if len(records) < 1 {
		return nil, errors.New("csv file is empty or invalid")
	}

	header := records[0]
	var result []map[string]string

	for _, record := range records[1:] {
		row := make(map[string]string)
		for i, value := range record {
			row[header[i]] = value
		}
		result = append(result, row)
	}

	return result, nil
}

func processCSVData(db *bbolt.DB, account, credentialType string, csvData []map[string]string) error {
	switch credentialType {
	case "passwords":
		return db.Update(func(tx *bbolt.Tx) error {
			bucket := tx.Bucket([]byte(database.BucketPassword))
			if bucket == nil {
				log.Println("passwords bucket is nil")
				return eh.ErrInternalServer
			}

			for _, row := range csvData {
				createdAt, _ := time.Parse(time.RFC3339, row["created_at"])

				password := models.Password{
					ID:       row["id"],
					Title:    row["title"],
					Username: row["username"],
					Pwd:      row["pwd"],
					Settings: models.Settings{
						Favorite: parseBool(row["favorite"]),
						Group:    row["group"],
						Icon:     row["icon"],
						Status:   row["status"],
					},
					CreatedAt: createdAt,
				}

				keyName := fmt.Sprintf("%s:%s", account, password.ID)
				passwordByte, err := json.Marshal(password)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}

				err = bucket.Put([]byte(keyName), passwordByte)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}
			}

			return nil
		})

	case "cards":
		return db.Update(func(tx *bbolt.Tx) error {
			bucket := tx.Bucket([]byte(database.BucketCards))
			if bucket == nil {
				log.Println("cards bucket is nil")
				return eh.ErrInternalServer
			}

			for _, row := range csvData {
				number, _ := strconv.ParseUint(row["number"], 10, 64)
				securityCode, _ := strconv.ParseUint(row["security_code"], 10, 32)
				expiry, _ := time.Parse(time.RFC3339, row["expiry"])
				createdAt, _ := time.Parse(time.RFC3339, row["created_at"])

				card := models.Card{
					ID:           row["id"],
					Card:         row["card"],
					Holder:       row["holder"],
					Number:       uint(number),
					Expiry:       expiry,
					SecurityCode: uint(securityCode),
					Settings: models.Settings{
						Favorite: parseBool(row["favorite"]),
						Group:    row["group"],
						Icon:     row["icon"],
						Status:   row["status"],
					},
					CreatedAt: createdAt,
				}

				keyName := fmt.Sprintf("%s:%s", account, card.ID)
				cardByte, err := json.Marshal(card)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}

				err = bucket.Put([]byte(keyName), cardByte)
				if err != nil {
					log.Println(err)
					return eh.ErrInternalServer
				}
			}

			return nil
		})

	default:
		return eh.NewGoPassError("unsupported credentials type")
	}
}

// Helper function to parse bool from string
func parseBool(value string) bool {
	result, err := strconv.ParseBool(value)
	if err != nil {
		log.Println("Error parsing boolean:", err)
		return false
	}
	return result
}
