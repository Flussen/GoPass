package database

import (
	"log"
	"time"

	"go.etcd.io/bbolt"
)

func OpenDB() *bbolt.DB {
	db, err := bbolt.Open("userDB.db", 0600, &bbolt.Options{Timeout: 1 * time.Second})
	if err != nil {
		log.Fatal(err)
	}
	return db
}
