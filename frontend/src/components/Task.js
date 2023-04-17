import React, {useState} from 'react'
import ToDoForm from './ToDoForm'
import {RiCloseCircleLine} from 'react-icons/ri'
import {TiEdit} from 'react-icons/ti'
// using react icons to get better descriptors for tasks

function Task({tasks, completeTask, removeTask, updateTask}) {
    const[edit, setEdit] = useState({
        id: null,
        value: ""
    })

    const submitUpdate = (value) => {
        updateTask(edit.id, value)
        setEdit({ 
            id: null,
            value:""
        })
    }

    if (edit.id) {
        return <ToDoForm edit={edit} onSubmit={submitUpdate} />
    }

    // map through all Todo Tasks
    // parenthesis mean working with JSX (HTML)
    /* ternary operator so on completion can apply diff CSS*/
    // each object (form from ToDoForm), task from here has id, text, status (int, string, bool)
    return tasks.map((task, index) => (
        <div 
            className={task.status ? "task-row complete" : "task-row"}
            key={index}
        > 
            <div key={task.id} onClick={() => completeTask(task.id)}>
                {task.text}
            </div>
            <div className="icons">
                <RiCloseCircleLine onClick={() => removeTask(task.id)} className = "deleteIcon"/>
                <TiEdit onClick={() => setEdit({id: task.id, value:task.text})} className = "editIcon"/>
            </div>

        </div>

    ))
}

export default Task