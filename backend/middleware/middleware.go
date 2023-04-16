// handles communication with the DB
package middleware

import (
	"context"
	"encoding/json" // encoding to JSON for db
	"fmt"
	"log"
	"net/http" // using bson's for encoding instead of Google protobuf, could implement change later
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/cglavin50/to-do/backend/models" // can change to local roots (relative) if I install to goroot
	"github.com/gorilla/mux"
	"github.com/joho/godotenv" // repo for working with env vars from parent .env
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection
var client *mongo.Client

// initialization functions //
func init() {
	loadENV()
	createDBInstance()
}

func loadENV() { // load the .env files to fetch vars later
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading the .env file in middleware:", err)
	}
}

func createDBInstance() { // initialize the db vars from .env
	if len(os.Args) == 1 {
		log.Fatal("Error, please pass in -c or -l for a cloud or local deployment")
	}

	dbName := os.Getenv("DB_NAME")
	collectionName := os.Getenv("DB_COLLECTION_NAME")

	if os.Args[1] == "-c" {
		username := url.QueryEscape(os.Getenv("USERNAME"))
		pswd := url.QueryEscape(os.Getenv("PASSWORD"))
		uri := "mongodb+srv://" + username + ":" + pswd + "@todolist.bot8xq3.mongodb.net/?retryWrites=true&w=majority"
		fmt.Println("uri:", uri)
		serverAPIOptions := options.ServerAPI(options.ServerAPIVersion1)
		clientOptions := options.Client().
			ApplyURI(uri).
			SetServerAPIOptions(serverAPIOptions) // TLS support implicitly enabled for encryption
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		client, err := mongo.Connect(ctx, clientOptions)
		if err != nil {
			log.Fatal("Error connecting to Mongo- ", err)
		}
		err = client.Ping(context.TODO(), nil) // pinging connection for text
		if err != nil {
			log.Fatal("Error, failed to ping the db:", err)
		}
		fmt.Println("Established connection to MongoDB Atlas database")
		collection = client.Database(dbName).Collection(collectionName) // defining our global variable
		fmt.Println("Collection instance created")
	} else {
		connectionString := os.Getenv("DB_URI")

		fmt.Printf("connectionString = %s, dbName = %s, collectionName = %s\n", connectionString, dbName, collectionName)

		clientOptions := options.Client().ApplyURI(connectionString)
		// ^format: protocol://user:pass@hostname/ip:port/connectionOptions
		// we are using mongodb://localhost:27017, expand later

		// create a mongoDB client object by passing in a ClientOptions object (with the URI), as well as a context
		client, err := mongo.Connect(context.TODO(), clientOptions)
		if err != nil {
			log.Fatal("Error, failed in creating client:", err)
		}

		err = client.Ping(context.TODO(), nil) // pinging connection for text
		if err != nil {
			log.Fatal("Error, failed to ping the db:", err)
		}
		fmt.Println("Established connection to MongoDB database")

		collection = client.Database(dbName).Collection(collectionName) // defining our global variable
		fmt.Println("Collection instance created")
	}
}

// end intitialiation functions //

// handling HTTP requests //

// TO DO: read the documentaiton for these below functions, fully understand the HTTP headers
// TO DO: if I port out the DB, need better access-control policy
func GetAllTasks(writer http.ResponseWriter, r *http.Request) {
	// set headers
	writer.Header().Set("Content-Type", "application/x-www-form-urlencoded") // content type vs content type? either way, defines what we are working with
	writer.Header().Set("Access-Control-Allow-Origin", "*")                  // allow requests to come from anywhere *=wildcard, providing credentials will throw an error
	payload := getAllTasks()
	json.NewEncoder(writer).Encode(payload) // encode the payload via json package (it will be returned )
} // get all tasks

func CreateTask(writer http.ResponseWriter, r *http.Request) {
	// set headers
	writer.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "POST")
	writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// parse the request and populate a model object task
	r.ParseForm()
	var task models.ToDoList
	var err error
	task.ID, err = strconv.Atoi(r.Form["ID"][0])
	if err != nil {
		log.Fatal(err)
	}
	task.Task = r.Form["Task"][0]
	task.Status, err = strconv.ParseBool(r.Form["Status"][0])
	if err != nil {
		log.Fatal(err)
	}
	insertTask(task)
} // create task

// is there a way to use pass-by-reference to update the the interface without explicitly calling this headers.set every time?
func UpdateTask(writer http.ResponseWriter, r *http.Request) {
	// set headers
	writer.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "PUT")
	writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// as I am getting the ID anyways while populating, the mux.Vars is unneccessary. However, I wanted to learn about deconstructing URL routes so left it in
	params := mux.Vars(r)
	// populate the task object
	// parse the request and populate a model object task
	r.ParseForm()
	var task models.ToDoList
	var err error
	task.ID, err = strconv.Atoi(r.Form["ID"][0])
	if err != nil {
		log.Fatal(err)
	}
	task.Task = r.Form["Task"][0]
	task.Status, err = strconv.ParseBool(r.Form["Status"][0])
	if err != nil {
		log.Fatal(err)
	}
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	updateTask(id, task)
} // update task

func DeleteTask(writer http.ResponseWriter, r *http.Request) {
	fmt.Println("Entered DeleteTask")
	writer.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	writer.Header().Set("Access-Control-Allow-Origin", "*")
	writer.Header().Set("Access-Control-Allow-Methods", "DELETE")
	writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		log.Fatal(err)
	}
	deleteTask(id)
} // delete task

func DeleteAllTasks(writer http.ResponseWriter, r *http.Request) {
	writer.Header().Set("Content-Type", "application/x-www-form-urlencoded")
	writer.Header().Set("Access-Control-Allow-Origin", "*")

	count := deleteAllTasks()
	json.NewEncoder(writer).Encode(count)
} // delete all tasks

// task update functions
func updateTask(id int, task models.ToDoList) {
	// fmt.Println("Editing task " + id)
	// fmt.Println("Task.ID: " + task.ID)
	filter := bson.M{"id": id}                                                              //bson.M returns the data as a map, and assuming ID's are unique, this will work fine, other possibiltiy is using D to create slice (unfixed size array)
	data := bson.M{"$set": bson.M{"id": task.ID, "task": task.Task, "status": task.Status}} // have this here just in case, this can be generalized to an updateFunction
	result, err := collection.UpdateOne(context.Background(), filter, data)
	if err != nil {
		log.Fatal("Error updating one in DB during complete:", err)
	}
	fmt.Println("Modified count:", result.ModifiedCount)
}

func getAllTasks() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}}) // pass empty query, so get everything that is stored in the db (get all tasks)
	if err != nil {
		log.Fatal("Error in finding tasks: ", err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result) // whatever we get will get decoded in the form of result (bson.M). Decode the BSON to JSON using M, then append to results
		if e != nil {
			log.Fatal(e)
		}
		results = append(results, result) // append result to results as we go, if we don't catch error on decode
	}
	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background()) // close the collection
	return results
}

func insertTask(task models.ToDoList) {
	insertResult, err := collection.InsertOne(context.Background(), task)
	if err != nil {
		log.Fatal("Error inserting task: ", err)
	}

	fmt.Println("Inserted single record", insertResult.InsertedID)
}

// func undoTask(task string) {
// 	id, _ := primitive.ObjectIDFromHex(task) // why is task in hex?
// 	filter := bson.M{"_id": id}
// 	update := bson.M{"$set": bson.M{"status": false}}
// 	result, err := collection.UpdateOne(context.Background(), filter, update) // use filter to get the ID, then update to status true
// 	if err != nil {
// 		log.Fatal("Error updating one in DB during undo: ", err)
// 	}
// 	fmt.Println("Modified count:", result.ModifiedCount)
// }

func deleteTask(id int) {
	filter := bson.M{"id": id}
	delete, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		log.Fatal("Error in deleting one: ", err)
	}

	fmt.Println("Deleted document:", delete.DeletedCount) // deleted count is the number of deleted documents
}

func deleteAllTasks() int64 {
	delete, err := collection.DeleteMany(context.Background(), bson.D{{}}) // empty query to get all, delete all
	if err != nil {
		log.Fatal("Error in deleting all: ", err)
	}

	fmt.Println("Deleted documents ", delete.DeletedCount)
	return delete.DeletedCount
}
