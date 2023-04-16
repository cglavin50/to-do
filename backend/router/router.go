package router

import (
	"github.com/cglavin50/to-do/backend/middleware"
	"github.com/gorilla/mux" // the external package to handle multiplexing
)

func Router() *mux.Router {
	r := mux.NewRouter()
	// get and create
	r.HandleFunc("/api/task", middleware.GetAllTasks).Methods("GET", "OPTIONS")
	// r.HandleFunc("/api/task/{id}", middleware. // implement get Task by ID later
	r.HandleFunc("/api/task", middleware.CreateTask).Methods("POST", "OPTIONS")
	// mark task as complete and undo (status updates)
	r.HandleFunc("/api/task/{id}", middleware.UpdateTask).Methods("PUT", "OPTIONS") // handles completing a task
	//	r.HandleFunc("/api/undoTask/{id}", middleware.UndoTask).Methods("PUT", "OPTIONS") // handles undoing a completion
	// delete and delete all tasks
	r.HandleFunc("/api/deleteTask/{id}", middleware.DeleteTask).Methods("DELETE", "OPTIONS") // handles deleting
	r.HandleFunc("/api/deleteAllTasks", middleware.DeleteAllTasks).Methods("DELETE", "OPTIONS")

	return r
}
