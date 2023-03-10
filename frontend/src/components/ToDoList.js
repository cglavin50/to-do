import React, {useState} from 'react'
import ToDoForm from "./ToDoForm"
import Task from "./Task"

function ToDoList() {
    const [tasks, setTasks]  = useState([])

    const addTask = (task) => {
        //below is code to remove preceding spaces (or just space entries)
        if (!task.text || /^\s*$/.test(task.text)) {
            return
        }

        const newTasks = [task, ...tasks] // append tasks
        setTasks(newTasks)
        //console.log(task, ...tasks)
    };

    const updateTask = (taskID, newValue) => {
        //below is code to remove preceding spaces (or just space entries)
        if (!newValue.text || /^\s*$/.test(newValue.text)) {
            return;
        }

        // maps every item in prev (aka the tasks) to the same thing, and if the ID is a match change the value to newValue, else remain same
        setTasks(prev => prev.map(item => (item.id === taskID ? newValue : item)))
        //console.log(task, ...tasks)
    }

    const removeTask = (id) => {
        const removeArr = [...tasks].filter(task => task.id !== id);

        setTasks(removeArr);
    };

    const completeTask = (id) => {
        console.log("Entered completeTask", id);
        let updatedTaskList = tasks.map(task => {
            if (task.id === id) {
                task.isComplete = !task.isComplete
            }

            console.log("New status", task.isComplete);
            return task
        })
        setTasks(updatedTaskList)
       
    };

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