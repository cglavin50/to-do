import React from "react";
import "./App.css";
// We use Route in order to define the different routes of our application
 
// We import all the components we need in our app
import ToDoList from "./components/ToDoList";
 
const App = () => {
  //   var newTasks = [];
  //   axios.get(endpoint + "/api/task").then((response) => {
  //     console.log(response)
  //     const data = response.data
            
  //     for (let i = 0; i < data.length; i++)
  //     {
  //         const task = {
  //             id: data[i].id,
  //             text: data[i].task,
  //             status: data[i].status,
  //         }
  //         newTasks = [task, ...newTasks];
  //     }
  // });


 return (
   <div className="ToDoList">
     <ToDoList />
    </div>
 );
};
 
export default App;