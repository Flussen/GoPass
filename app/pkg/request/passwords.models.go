package request

type SavePassword struct {
	Account    string       `json:"account"`
	AccountKey string       `json:"accountKey"`
	Data       passwordData `json:"data"`
}

type DeletePassword struct {
	Account string `json:"account"`
	ID      string `json:"id"`
}

type UpdatePassword struct {
	Account    string       `json:"account"`
	AccountKey string       `json:"accountKey"`
	ID         string       `json:"id"`
	Data       passwordData `json:"data"`
}
