"use client"
import { useState } from "react";

export default function DayEditing() {
    const [taskList, setTaskList] = useState([]);
    const [newTask, setNewTask] = useState(""); 
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editedTask, setEditedTask]= useState("");
    const [doneTasks, setDoneTasks] = useState([]);

    const addTask = () => {
        if (newTask.trim() !== "") { 
            setTaskList([...taskList, newTask]); 
            setNewTask(""); 
        }
    };

    function handleKeyDown(event, id)  {
        if (id === 1) {
            if (event.key === "Enter"){
                addTask();
            }
        }
        else {
            if (event.key === "Enter"){
                updateTask();
            }

        }
    };
    
    const removeTask = (task) => {
        const updatedList = taskList.filter(t => t !== task);
        setTaskList(updatedList);
    };

    const handleEditTask = (task, index) => {
        setEditTaskIndex(index); 
        setEditedTask(task);
    };
    const updateTask = () => {
        if (editedTask.trim() !== "") {
            const updatedList = [...taskList];
            updatedList[editTaskIndex] = editedTask; 
            setTaskList(updatedList);
            setEditTaskIndex(null); 
            setEditedTask(""); 
        }
    };



    const toggleTaskStatus = (task) => {
        if (doneTasks.includes(task)) {
            const updatedList = doneTasks.filter(t => t !== task);
            setDoneTasks(updatedList);
        } else {
            const updatedList = [...doneTasks, task];
            setDoneTasks(updatedList);
        }
    };

    const addDescription = () => {
        
    };

    return (
        <div>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
                onKeyDown={(e) => handleKeyDown(e, 1)}
            />
            <button onClick={addTask}>Add task</button>
            <h3>Task List</h3>
            <ul>
                {taskList.map((task, index) => (
                    <li key={index}>
                        {editTaskIndex === index ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                />
                                <button onClick={updateTask}>Update</button>
                            </div>
                        ) : (
                            <div>
                                {task}
                                <button onClick={() => removeTask(task)}>Remove</button>
                                <button onClick={() => handleEditTask(task, index)}>Edit</button>
                                {doneTasks.includes(task) ? (
                                    <button
                                        style={{ color: "green", marginLeft: "10px" }}
                                        onClick={() => toggleTaskStatus(task)} 
                                    >
                                        &#10004; 
                                    </button>
                                ) : (
                                    <button onClick={() => toggleTaskStatus(task)}>Mark as done</button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
