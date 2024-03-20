package sessiontoken

import (
	"os"

	"github.com/joho/godotenv"
)

func getKey() (string, error) {
	err := godotenv.Load()
	if err != nil {
		return "", err
	}
	return os.Getenv("SECRETKEY"), nil
}
