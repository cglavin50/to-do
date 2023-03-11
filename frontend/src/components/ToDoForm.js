import React, { useState } from "react";
// import axios from "axios";

// // global variables
// var endpoint = "http://localhost:9000/"
// var querystring= require('querystring');
// end globals

function ToDoForm(props) {
    const [input, setInput] = useState('');

    const handleChange = (e) => {
        setInput(e.target.value); // set the input to input value
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // disabling refresh for now, might need to remove this

        // form properties: id, text, status
        props.onSubmit({
            id: Math.floor(Math.random() * 1000),
            text: input,
            status: false
        });

        setInput('')
    }

    return (
        <form className="todo-form" onSubmit = {handleSubmit}>
            <input 
                type="text" 
                placeholder="Create a task..." 
                value={input} 
                name="text" 
                className="todo-input"
                onChange = {handleChange}
            />
            <button className = "todo-button">Add Task</button>
        </form>
    )
}

export default ToDoForm