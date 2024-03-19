package sessiontoken

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateNewToken(id, user string) (string, error) {

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = id
	claims["username"] = user
	claims["exp"] = time.Now().Add(time.Hour * 720).Unix()

	key, err := getKey()
	if err != nil {
		return "", err
	}

	tokenString, err := token.SignedString([]byte(key))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
