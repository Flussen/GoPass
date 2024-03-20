package sessiontoken

import (
	"encoding/json"
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

func ReturnTokenContent(tokenString string) ([]byte, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Suponiendo que getKey() retorna tu clave secreta como string y error
		key, err := getKey()
		if err != nil {
			return nil, err
		}
		return []byte(key), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Prepara un mapa para los datos que se retornarán
		data := make(map[string]interface{})
		for k, v := range claims {
			data[k] = v
		}

		// Convierte el mapa a JSON
		jsonData, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}

		return jsonData, nil
	} else {
		return nil, fmt.Errorf("invalid token")
	}
}
