package errorhandler

import (
	"fmt"
	"testing"
)

// Test variables
var (
	TitleTest    = "I'am a Title for Testing"
	MessageTest  = "I'm a message Test for give more details"
	ArgumentTest = "thisIsATestArgument"
)

// Test 1:
//
//	func TestNewGoPassError(t *testing.T)
func riskyOperation() error {
	return NewGoPassError(TitleTest)
}

// Test 2:
//
//	func TestNewGoPassDetailedError(t *testing.T)
func riskyOperationDetailed() error {
	return NewGoPassDetailedError(TitleTest, MessageTest)
}

// Test 3:
//
//	func TestNewGoPassFormatError(t *testing.T)
func riskyOperationFormat() error {
	return NewGoPassErrorf("%s %v", TitleTest, ArgumentTest)
}

// Verifies if basic error is generated correctly
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

	testPassed = true
}

// Verifies if detailed error is generated correctly
func TestNewGoPassDetailedError(t *testing.T) {
	err := riskyOperationDetailed()
	if err != nil {
		if GoPassErr, ok := err.(*GoPassErrors); ok {
			fmt.Println("Error:", GoPassErr.DetailedError())
		} else {
			t.Fatal("Error is not of type *GoPassErrors")
		}
	} else {
		t.Fatal("Expected an error but got nil")
	}
}

// Verifies if error with format is generated correctly
func TestNewGoPassFormatError(t *testing.T) {
	err := riskyOperationFormat()
	if err != nil {
		if GoPassErr, ok := err.(*GoPassErrors); ok {
			if assertTest := GoPassErr.Error(); assertTest == TitleTest+" "+ArgumentTest {
				fmt.Println("Passed Error:", GoPassErr.Error())
			} else {
				fmt.Printf("INFO: %s", assertTest)
				panic("title and argument are not equivalent to the test")
			}
		} else {
			t.Fatal("Error is not of type *GoPassErrors")
		}
	} else {
		t.Fatal("Expected an error but got nil")
	}
}

func errortodo() error {
	return NewGoPassErrorf(ErrLogicFunctionName, "Function to Test!")
}

func TestFormatInString(t *testing.T) {
	err := errortodo()
	if err != nil {
		fmt.Println(err)
	}
}
