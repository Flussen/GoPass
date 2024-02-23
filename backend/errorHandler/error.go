package errorhandler

import "fmt"

type GoPassErrors struct {
	Title   string
	Message string
}

const (
	ErrLogin_AuthenticationFailure = "authentication failure"
	ErrBucketNotFound              = "'Users' bucket not found"
	ErrUserNotFound                = "could not get the user within this bucket"
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
