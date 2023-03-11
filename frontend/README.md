# This file covers the design of the front-end
As I am new to React (and front-end work in general), this will cover my outline for the scheme to handle to front-end of this project, written in React JS and styled with CSS and Flexbox.
Teaching myself functional React as well, moving away from OOP as this seems to have been phased out, especially for front-end work.

## Composition
**Task**
This handles the basic building block of a To Do List, aka a Task. Each Task has an ID, Status (in-progress = false, done = true), and a Task (the thing to do). Each task will be represented by a card in our "block" or stack, and needs to show the Task string. 
Needs methods to handle update (so I can change the task in case of a typo), deleteTask (select-and-delete), and completeTask.
- Update Task: When choosing to update a task, focus on it (inputRef.focus()), and create a ToDoForm to handle the submission of new information, and update the Task's Task accordingly.
- Delete Task: Just need to create an icon (likely using React Icon's CloseCircleLine), that will call ToDoList::deleteTask(task)
- Complete Task: In future work, test out different functionalities for this. Current goal is to have upon click, update the font to a slash-through, and maybe darken. This can be done by checking the Task's status, and change the className accordingly to update the styling within the CSS file.

**ToDoForm**
This handles the form in which the user can input the information to create a new Task. Will serve dual-purpose, such that if someone wants to change a Task, can reuse the form here to edit it. Is a basic form that handles an input string, and upon entering will submit, refresh the values so the box can be reused, and send the submission to the list to handle.

**ToDoList**
This handles the functions of connecting to the backend with addTask, deleteTask, updateTask, and completeTask. Will need to connect the local changes to the DB, implemented using axios HTTP functions. Actual HTML is just have a ToDoForm and a Task stacked.

### Future Work
1. Next goal is to create a button that can clear out all completed tasks. In terms of 'back-end' this can be as simple as deleting tasks with status=true, however would like to create a nice CSS animation to make the user feel accomplished about finishing tasks.
2. Look into creating a drag-and-drop scheme to order tasks (or if I add a task.tag attribute, use that to order, ex by urgency).