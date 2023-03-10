import React, {useState, useEffect, useRef} from 'react'

function ToDoForm(props) {
    const[input, setInput] = useState(props.edit ? props.edit.value : "") 

    const inputRef = useRef(null);
    //useEffect will run when isEditing is changing, meaning when a field is being edited, this function will enter and focus on it
    useEffect(() => {
        inputRef.current.focus()
    })

    const handleChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault() // meaning don't refresh on submit, will likely remove as I am connecting to a backend
        props.onSubmit({
            id: Math.floor(Math.random() * 10000), // should implement a count for this later, instead of doing random
            text: input
        });
        
        setInput(""); // reset input
    }
    
    return (
        <form className="ToDoForm" onSubmit={handleSubmit}>
            {props.edit ? ( 
                <>
                <input 
                type="text" 
                placeholder="Update task" 
                value={input} 
                name="text" 
                className="ToDoForm-Input edit"
                onChange={handleChange}
                ref={inputRef}
            />
            <button className="ToDoForm-Button edit">Update</button>
            </>
            ) : (
                <>
                <input 
                type="text" 
                placeholder="Create Task..." 
                value={input} 
                name="text" 
                className="ToDoForm-Input"
                onChange={handleChange}
                ref={inputRef}
            />
            <button className="ToDoForm-Button">Add Task</button>
            </>
            )}
            
            
        </form>
  )
}

export default ToDoForm