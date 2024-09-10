package exportation

import (
	"GoPass/backend/credentials/cards"
	"GoPass/backend/credentials/passwords"
	eh "GoPass/backend/errorHandler"
	"GoPass/backend/pkg/request"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"reflect"
	"time"

	"go.etcd.io/bbolt"
)

func Export(db *bbolt.DB, account string, rqst request.Export) error {
	if rqst.CredentialsType == nil || rqst.ExportType == "" {
		return eh.ErrEmptyParameter
	}

	for i, v := range rqst.CredentialsType {
		if v == "cards" || v == "passwords" {

			switch v {
			case "passwords":
				passwordsContainer, err := passwords.GetAllPasswords(db, account)
				if err != nil {
					return err
				}

				if rqst.ExportType == "json" {
					err = jsonExport(account, v, passwordsContainer)
					if err != nil {
						return err
					}
				} else if rqst.ExportType == "csv" {
					csvExport(account, v, passwordsContainer)
				}

			case "cards":
				cardsContainer, err := cards.GetAllCards(db, account)
				if err != nil {
					return err
				}

				if rqst.ExportType == "json" {
					err = jsonExport(account, v, cardsContainer)
					if err != nil {
						return err
					}
				} else if rqst.ExportType == "csv" {
					csvExport(account, v, cardsContainer)
				}
			default:
				log.Printf("invalid type credentials: index %d with value %s", i, v)
				return eh.NewGoPassError("invalid type credentials or empty")
			}
		} else {
			log.Printf("invalid type credentials: index %d with value %s", i, v)
			return eh.NewGoPassError("invalid type credentials or empty")
		}

	}
	return nil
}

func jsonExport(account, typeExport string, container any) error {
	filename := fmt.Sprintf("%v-%v.json", account, typeExport)
	containerBytes, err := json.MarshalIndent(container, "", "\t")
	if err != nil {
		log.Println("ERROR", err)
		return eh.ErrInternalServer
	}

	err = os.WriteFile(filename, containerBytes, 0664)
	if err != nil {
		log.Println(err)
		return eh.ErrInternalServer
	}
	return nil
}

func csvExport(account, typeExport string, container any) error {
	filename := fmt.Sprintf("%v-%v.csv", account, typeExport)
	file, err := os.Create(filename)
	if err != nil {
		log.Println("ERROR", err)
		return eh.ErrInternalServer
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	rv := reflect.ValueOf(container)
	if rv.Kind() != reflect.Slice {
		log.Println("ERROR: container is not a slice")
		return eh.ErrInternalServer
	}

	if rv.Len() > 0 {
		elemType := rv.Index(0).Type()
		header := []string{}
		for i := 0; i < elemType.NumField(); i++ {
			if elemType.Field(i).PkgPath == "" { // PkgPath is empty for exported fields
				header = append(header, elemType.Field(i).Name)
			}
		}
		if err := writer.Write(header); err != nil {
			log.Println("ERROR writing header:", err)
			return eh.ErrInternalServer
		}
	}

	for i := 0; i < rv.Len(); i++ {
		elem := rv.Index(i)
		record := []string{}
		for j := 0; j < elem.NumField(); j++ {
			field := elem.Field(j)
			if elem.Type().Field(j).PkgPath != "" { // Skip unexported fields
				continue
			}

			var value string
			switch field.Kind() {
			case reflect.String:
				value = field.String()
			case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
				value = fmt.Sprintf("%d", field.Uint())
			case reflect.Struct:
				if t, ok := field.Interface().(time.Time); ok {
					value = t.Format(time.RFC3339)
				} else {
					value = fmt.Sprintf("%v", field.Interface())
				}
			default:
				value = fmt.Sprintf("%v", field.Interface())
			}

			record = append(record, value)
		}
		if err := writer.Write(record); err != nil {
			log.Println("ERROR writing record:", err)
			return eh.ErrInternalServer
		}
	}
	return nil
}
