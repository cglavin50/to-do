import React from "react";
 
// We use Route in order to define the different routes of our application
 
// We import all the components we need in our app
import ToDoList from "./components/ToDoList";
import ToDoForm from "./components/ToDoForm";
 
const App = () => {
 return (
   <div>
     <ToDoList />
    </div>
 );
};
 
export default App;