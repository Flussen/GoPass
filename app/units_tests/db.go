package units_tests

import (
	"os"

	"go.etcd.io/bbolt"
)

func CreateTestDB() (*bbolt.DB, func()) {
	tmpfile, err := os.CreateTemp("", "testdb_*.db")
	if err != nil {
		panic("Error in mock database")
	}

	db, err := bbolt.Open(tmpfile.Name(), 0600, nil)
	if err != nil {
		panic("Error in mock database")
	}

	cleanup := func() {
		db.Close()
		os.Remove(tmpfile.Name())
	}

	return db, cleanup
}
