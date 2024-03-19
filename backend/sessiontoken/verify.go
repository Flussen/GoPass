package sessiontoken

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func VerifyToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signature method: %v", token.Header["alg"])
		}

		key, err := getKey()
		if err != nil {
			return nil, err
		}

		return []byte(key), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if exp, ok := claims["exp"].(float64); ok {
			now := time.Now().Unix()
			if int64(exp) < now {
				return nil, fmt.Errorf("expired token, please log in again")
			}
		}
		return token, nil
	} else {
		return nil, err
	}
}
