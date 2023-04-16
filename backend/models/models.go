package models // import title for main
// provides middle-man for converting mongoDO json objects to golang-usable objects

// storing tasks in a mongoDB database, so need this driver

// struct to marshal JSON to BSON format for MongoDB, MongoDB uses BSOn for internal storage
type ToDoList struct { // Golang data structure
	// using ` for string literals to avoid complications with escape characters
	// omitempty means if there is no value, or if a value is set to its defaul, it will omit the key from the JSON/BSON obj (ex pointer = nil, string = "", all will be omitted)
	// use it to get rid of the empty values appended, as everything is a string array, and we only want populated values
	// the BSON tags tell the Driver to take ID and in the BSON document store it as ID, and omit empty
	ID     int    `bson:ID,omitempty`
	Task   string `bson:Task,omitempty`
	Status bool   `bson:Status,omitempty`
}
