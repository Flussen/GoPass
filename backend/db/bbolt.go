package database

import (
	"log"  // Package for logging
	"time" // Package for handling time

	"go.etcd.io/bbolt" // Package for handling Bolt databases
)

// OpenDB opens the Bolt database and returns a pointer to it
func OpenDB() *bbolt.DB {
	// Open the Bolt database with the given name and options
	db, err := bbolt.Open("userDB.db", 0600, &bbolt.Options{Timeout: 1 * time.Second})
	if err != nil {
		log.Fatal(err) // Log fatal error if database opening fails
	}
	return db // Return the database pointer
}
