package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/cglavin50/to-do/backend/router" // server folder is the git repo, using this to access modules
	//"to-do/router" // giving package names so can reference locally
)

func main() {
	r := router.Router()
	port := "9000" // turn into env var or command line arg later, hardcoding for now
	fmt.Printf("Starting the server on port %v...\n", port)

	// note: http.ListenAndServe always r eturns a non-nil error, debug later
	log.Fatal(http.ListenAndServe(":"+port, r)) // serves handler r (router) all incoming connections on tcp.port=9000

}
