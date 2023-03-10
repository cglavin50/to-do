package models // import title for main
// provides middle-man for converting mongoDO json objects to golang-usable objects

import (
	"go.mongodb.org/mongo-driver/bson/primitive" // storing tasks in a mongoDB database, so need this driver
)

type ToDoList struct { // Golang data structure
	// using ` for string literals to avoid complications with escape characters
	ID     primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // show go its structure in json and bson
	Task   string             `json:"task,omitempty"`
	Status bool               `json:"status,omitempty"`
}
