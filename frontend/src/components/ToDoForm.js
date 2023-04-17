import React, { useState } from "react";
// import axios from "axios";

// // global variables
// var endpoint = "http://localhost:9000/"
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
        <form className="ToDoForm" onSubmit = {handleSubmit}>
            <input 
                type="text" 
                placeholder="Create a task..." 
                value={input} 
                name="text" 
                className="ToDoForm-Input"
                onChange = {handleChange}
            />
            <button className = "ToDoForm-Button">Add Task</button>
        </form>
    )
}

export default ToDoForm