package app

import (
	"os"
	"testing"

	"go.etcd.io/bbolt"
)

// temp Const
const (
	user     = "UserTest1"
	mailUser = "test1@gmail.com"
	passUser = "myPass1"
)

func CreateTestDB(t *testing.T) (*bbolt.DB, func()) {
	tmpfile, err := os.CreateTemp("", "testdb_*.db")
	if err != nil {
		t.Fatalf("failed to create temp file: %v", err)
	}

	db, err := bbolt.Open(tmpfile.Name(), 0600, nil)
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}

	cleanup := func() {
		db.Close()
		os.Remove(tmpfile.Name())
	}

	return db, cleanup
}
