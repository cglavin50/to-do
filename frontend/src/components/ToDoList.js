import React, {useState, useEffect} from 'react'
import ToDoForm from "./ToDoForm"
import Task from "./Task"
import axios from "axios"

// global vars for axios //
var endpoint = "http://localhost:9000";
URLSearchParams = require('@ungap/url-search-params')


// const getTasks = async () =>
//   (await axios.get("/api/task", { baseURL: endpoint })).data
//     .map(({ id, task, status }) => ({
//       id,
//       text: task,
//       status,
//     }));

function ToDoList() {
    const [tasks, setTasks]  = useState([])
    //Note: calls to useState will rerender

    // use .then()
    const getTasks = async () => {
        const response = await axios.get(endpoint + "/api/task")
        console.log(response)

        if (response.data)
        {
            const data = response.data
            var newTasks = [];
            for (let i = 0; i < data.length; i++)
            {
                const task = {
                    id: data[i].id,
                    text: data[i].task,
                    status: data[i].status,
                }
                newTasks = [task, ...newTasks];
            }
            return newTasks;
        }
        else 
        {
            return null;
        }
    }

    useEffect(() => {
        getTasks().then((newTasks) => {
            if (newTasks.length > 0)
            {
                setTasks(newTasks);
            }
        }).catch(console.warn);
    }, []);
    
    const addTask = async (form) => {
        //const nt = await getTasks();
        // remove unnecessary spaces
        if (!form.text || /^\s*$/.test(form.text))
        {
            return
        }
        // post request, axios by default will serialize JS objects to JSON, so we want to send in application/x-www-form-urlencoded as just sending a couple small pairs of info
        // look into encryption later
        const params = {
            ID: form.id,
            Task: form.text,
            Status: form.status
        };
        const searchParams = new URLSearchParams(params);
        const response = await axios.post(endpoint + "/api/task", 
        searchParams.toString(),
        {headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }});
        console.log("Response:");
        console.log(response);

        const newTasks = [form, ...tasks];
        setTasks(newTasks);

        console.log(form, ...tasks);
    }
    
    const updateTask = async (taskID, newValue) => {
        // remove unnecessary spaces
        if (!newValue.text || /^\s*$/.test(newValue.text))
        {
            return;
        }

        // create put request
        // use the new ID value randomly assigned in the form. Use old one to put and update new to new id
        let params = {
            ID: newValue.id,
            Task: newValue.text,
            Status: newValue.status
        }
        const searchParams = new URLSearchParams(params);
        const response = await axios.put(endpoint + "/api/task/" + taskID, 
        searchParams.toString(),
        {headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }});
        console.log("Response:");
        console.log(response);
        const newTasks = tasks.map(item => item.id === taskID ? newValue : item)
        setTasks(newTasks); // look over, if id matches set that task to newValue
    }

    // remove from the array of tasks, then remove from DB
    const removeTask = async (id) => {
        // delete request
        // while each ID should be unique, this way we implicitly handle the case where there are no tasks with this ID
        // while this is less time efficient, again at the scale we are working with this is minimal, can be improved later
        for (let t of tasks) {
            if (t.id === id) {
                const headers =  {'Content-Type': 'application/x-www-form-urlencoded'}
                const response = await axios.delete(endpoint + "/api/deleteTask/" + id, headers);
                console.log("Response");
                console.log(response);
            }
        }

        const removeArr = [...tasks].filter(task => task.id !== id); // filter by only adding tasks without passed in ID
        // ^ this isn't the most space efficient, however working with small-scale JSON records, so can optimize later
        setTasks(removeArr)
    }

    // complete task just updates status to mark it as 'completed', or done
    // need to then put the record to update status in the DB
    const completeTask = async (id) => {
        const params = {
            ID: 0,
            Task: "",
            Status: false,
        };

        let updatedTasks = tasks.map(task => {
            if (task.id === id) {
                task.status = !task.status

                // after matching ID, get all the new values
                params.ID = task.id
                params.Task = task.text
                params.Status = task.status
            }

            return task
        });
        // now with params, send a put
        const searchParams = new URLSearchParams(params);
        const response = await axios.put(endpoint + "/api/task/" + id, 
        searchParams.toString(),
        {headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }});
        console.log("Response:");
        console.log(response);

        setTasks(updatedTasks)
        console.log(...tasks)
    }

    return (
        <div>
            <h1>What to do Today</h1>
            <ToDoForm onSubmit={addTask} />
            <Task 
                tasks={tasks}
                completeTask={completeTask}
                removeTask={removeTask}
                updateTask={updateTask}
            />
        </div>
    )
}

export default ToDoList