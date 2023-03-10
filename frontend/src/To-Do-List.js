import React, {Component} from "react";
import axios from "axios"; // backend connnetion
import {Card, Header, Form, Input, Icon} from "semantic-ui-react"; //storing the list as a form

let endpoint = "http://localhost:9000"; //running on 9000, can change to env variable later, see what ports I'm running on my host computer later

class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task:"",
            items:[],
        };
    }

    //mount the Component
    componentDidMount() {
        this.getTask();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    };

    //create task (submitting a task/form), send a post request with the encoded information
    onSubmit = () => {
        let {task} = this.state;
        if (task) {
            axios.post(endpoint + "/api/task",
            {task,},
            {headers: 
                {
                    "Content-Type": "application.x-www-form-urlencoded",
                },
            }
            ).then((res) => {
                this.getTask();
                this.setState({ task:"", });
                console.log(res);
            });
        }
    };

    getTask = () => {
        axios.get(endpoint + "/api/task").then((res)=> {
            if (res.data) {
                this.setState({
                    items: res.data.map(item => {
                        let color = "yellow";
                        let style = {
                            wordWrap: "break-word",
                        };
                        
                        // state is true if the task.status = true, so then put a line through
                        if (item.state) {
                            color = "green";
                            style["textDecorationLine"] = "line-through";
                        }

                        return (
                            <Card key={item._id} color={color} fluid className="rough">
                                <Card.Content>
                                    <Card.Header textALign="left">
                                        <div style={style}>{item.task}</div>
                                    </Card.Header>
                                    <Card.Meta textAlign="right">
                                        <Icon 
                                            name = "check circle" 
                                            color = "blue" 
                                            onClick={() => this.updateTask(item._id)}
                                        />
                                        <span style={{paddingRight: 10}}>Undo</span>
                                        <Icon  
                                            name = "delete"
                                            color = "red"
                                            onClick={() => this.deleteTask(item._id)}
                                        />
                                        <span style={{paddingRight:10}}>Delete</span>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        );
                    }),
                });
            }
            else {
                this.setState({
                    items:[],
                });
            }
        });
    };

    // put request ("content-type"), get, log the request, then get the task
    updateTask = (id) => {
        axios.put(endpoint + "/api/tasks" + id, {
            headers:{
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    };

    undoTask = (id) => {
        axios.put(endpoint + "/api/undoTask" + id, {
            headers:{
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    };

    deleteTask = (id) => {
        axios.delete(endpoint + "/api/deleteTask" + id, {
            header:{
                "Content-Type" : "application/x-www-form-urlencoded",
            },
        }).then((res) => {
            console.log(res);
            this.getTask();
        });
    };

    render() { //render, using a h2 header for now
        return (
          <div>
            <div className = "row">
                <Header className = "header" as="h2" color="yellow">
                    To Do List:    
                </Header> 
            </div>
            <div className = "row">
                <Form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        name="task"
                        onChange={this.onChange}
                        value={this.state.task}
                        fluid
                        placeholder="Create Task..."
                    />
                    {/*<Button> Create Task </Button>*/}
                    <input type="submit" value="Submit"></input>
                </Form>
            </div>
            <div className = "row"> 
                <Card.Group>{this.state.items}</Card.Group>
            </div> {/*the above displays all items/tasks*/}
          </div>  
        );
    }
}

export default ToDoList; 



