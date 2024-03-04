package app

import (
	"os"
	"testing"

	"go.etcd.io/bbolt"
)

func CreateTestDB(t *testing.T) (*bbolt.DB, func()) {
	// Crear un archivo temporal para la base de datos
	tmpfile, err := os.CreateTemp("", "testdb_*.db")
	if err != nil {
		t.Fatalf("failed to create temp file: %v", err)
	}

	// Abrir la base de datos bbolt en el archivo temporal
	db, err := bbolt.Open(tmpfile.Name(), 0600, nil)
	if err != nil {
		t.Fatalf("failed to open db: %v", err)
	}

	// Función para cerrar y eliminar la base de datos temporal
	cleanup := func() {
		db.Close()
		os.Remove(tmpfile.Name())
	}

	return db, cleanup
}
