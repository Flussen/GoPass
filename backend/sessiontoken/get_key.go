package sessiontoken

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func getKey() (string, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println("cannot load secret")
	}

	secretKey := os.Getenv("SECRETKEY")
	if secretKey == "" {
		log.Println("cannot get secret key")
	}

	return secretKey, err
}
