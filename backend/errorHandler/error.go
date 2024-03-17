package errorhandler

import (
	"fmt"
	"runtime"
)

type GoPassErrors struct {
	Title   string
	Message string
}

const (
	ErrLogin_AuthenticationFailure = "authentication failure"
	ErrBucketNotFound              = "'Users' bucket not found"
	ErrUserNotFound                = "could not get the user within this bucket"
	ErrInvalidCredentils           = "invalid credentials"
	ErrUnmarshal                   = "error from Unmarshal process"
	ErrMarshal                     = "error from Marshal process"
	ErrLogicFunctionName           = "logic or implementation error, please check in '%s' Go Function"
	ErrEmptyParameters             = "none of the parameters can be empty"
	ErrInvalidUserKey              = "the userKey is invalid"
)

func (e *GoPassErrors) Error() string {
	return e.Title
}

func (e *GoPassErrors) DetailedError() string {
	return fmt.Sprintf("%s: %s", e.Title, e.Message)
}

func NewGoPassError(title string) error {
	return &GoPassErrors{Title: title}
}

func NewGoPassDetailedError(title, message string) error {
	return &GoPassErrors{Title: title, Message: message}
}

func NewGoPassErrorf(title string, a ...interface{}) error {
	if len(a) == 0 {
		warnCaller("Warning: NewGoPassErrorf called with 'title' but without formatting arguments. Consider using NewGoPassError for static messages.")
	}
	return &GoPassErrors{
		Title: fmt.Sprintf(title, a...),
	}
}

func warnCaller(msg string) {
	_, file, line, ok := runtime.Caller(2)
	if ok {
		fmt.Printf("%s - %s:%d\n", msg, file, line)
	} else {
		fmt.Println(msg)
	}
}
