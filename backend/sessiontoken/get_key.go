package sessiontoken

import (
	"os"

	"github.com/joho/godotenv"
)

func getKey() (string, error) {
	err := godotenv.Load()
	if err != nil {
		panic("cannot get secret key")
	}

	secretKey := os.Getenv("SECRETKEY")
	if secretKey == "" {
		panic("cannot get secret key")
	}

	return secretKey, err
}
