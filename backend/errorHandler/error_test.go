package errorhandler

import (
	"fmt"
	"testing"
)

func riskyOperation() error {
	return NewGoPassError(title)
}

func riskyOperationDetailed() error {
	return NewGoPassDetailedError(title, message)
}

var (
	title   = "failed operation"
	message = "bad server"
)

func TestNewGoPassError(t *testing.T) {
	var testPassed bool = false

	err := riskyOperation()
	if err != nil {
		fmt.Println("Error:", err)
		testPassed = true
	}

	if !testPassed {
		panic("defaultTest failure")
	}

	testPassed = false

	err = riskyOperationDetailed()
	if err != nil {
		fmt.Println("Error:", err)
		testPassed = true
	}

	if !testPassed {
		panic("detailedTest failure")
	}
}
