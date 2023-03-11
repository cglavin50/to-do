import React, {useState} from 'react'
import ToDoForm from "./ToDoForm"
import axios from "axios"

// global vars for axios //
var endpoint = "http://localhost:9000";
URLSearchParams = require('@ungap/url-search-params')

function ToDoList() {
    const [tasks, setTasks]  = useState([])

    
    const addTask = async (form) => {
        // remove unnecessary spaces
        if (!form.text || /^\s*$/.test(form.text))
        {
            return
        }

        // post request
        const params = {
            ID: form.id,
            Task: form.text,
            Status: form.status
        };
        const searchParams = new URLSearchParams(params);
        const response = await axios.post(endpoint + "/api/task", 
        {
            ID: form.id,
            Task: form.text,
            Status: form.status
        },
        {headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }});
        console.log(response);

        const newTasks = [form, ...tasks]
        setTasks(newTasks)

        console.log(form, ...tasks)
    }

    return (
        <div>
            <h1>What to do Today</h1>
            <ToDoForm onSubmit={addTask} />
            {/* <Task 
                tasks={tasks}
                completeTask={completeTask}
                removeTask={removeTask}
                updateTask={updateTask}
            /> */}
        </div>
    )
}

export default ToDoList