package recovery

import "math/rand"

func GenerateSeedPhrase(length int) []string {
	var container []string
	for i := 0; i < length; i++ {
		container = append(container, words[rand.Intn(len(words))])
	}

	return container
}
