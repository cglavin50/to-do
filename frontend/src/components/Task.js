import React, {useState} from 'react'
import ToDoForm from './ToDoForm'
import {RiCloseCircleLine} from "react-icons/ri"
import {TiEdit} from "react-icons/ti"

function Task({tasks, completeTask, removeTask, updateTask}) {
    const [edit, setEdit] = useState({
        id: null,
        value: "",
        isComplete: false,
    });

    const submitUpdate = (value) => {
        updateTask(edit.id, value);
        setEdit({
            id: null,
            value: "",
        })
    }
    if (edit.id) {
        return <ToDoForm edit={edit} onSubmit={submitUpdate} />;
    }
  
    return tasks.map((task, index) => (
        <div 
            className={task.IsComplete ? "task-row complete" : "task-row"}
            key={index}
        >
            <div key={task.id} onClick={() => {
                console.log("Clicked task: " + task.id);
                completeTask(task.id)}
            }>
                {task.text}
            </div>
            <div className="icons">
                {/*using ReactIcons*/}
                <RiCloseCircleLine 
                    onClick={() => removeTask(task.id)}
                    className="deleteIcon"
                />
                <TiEdit 
                    onClick={() => setEdit({ id: task.id, value: task.text})}
                    className="editIcon"
                />
            </div>

        </div>
    ))
}

export default Task