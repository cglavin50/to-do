import React from "react";
import "./App.css";
// We use Route in order to define the different routes of our application
 
// We import all the components we need in our app
import ToDoList from "./components/ToDoList";
 
const App = () => {
 return (
   <div className="ToDoList">
     <ToDoList />
    </div>
 );
};
 
export default App;