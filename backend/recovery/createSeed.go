package recovery

import "math/rand"

func GenerateSeedPhrase(length int) []string {
	var container []string

	indices := rand.Perm(len(words))

	for i := 0; i < length; i++ {
		container = append(container, words[indices[i]])
	}

	return container
}
