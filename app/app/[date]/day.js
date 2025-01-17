"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 

export default function DayEditing() {
    const { date } = useParams(); 
    const [taskList, setTaskList] = useState([]);
    const [newTask, setNewTask] = useState(""); 
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [doneTasks, setDoneTasks] = useState([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [descriptionInput, setDescriptionInput] = useState("");
    const [showDescriptions, setShowDescriptions] = useState({});
    const [prioritisations, setPrioritizations] = useState([])

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};

        if (parsedTasks[date]) {
            setTaskList(parsedTasks[date].tasks || []);
            setDoneTasks(parsedTasks[date].doneTasks || []);
        }

        setIsHydrated(true);
    }, [date]);

    useEffect(() => {
        if (isHydrated) {
            const storedTasks = localStorage.getItem("tasksByDate");
            const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
            parsedTasks[date] = {
                tasks: taskList,
                doneTasks: doneTasks,
            };

            localStorage.setItem("tasksByDate", JSON.stringify(parsedTasks));
        }
    }, [taskList, doneTasks, isHydrated, date]);

    const addTask = () => {
        if (newTask.trim() !== "") { 
            setTaskList([...taskList, { name: newTask, description: "" }]); 
            setNewTask(""); 
        }
    };

    const handleKeyDown = (event, id) => {
        if (id === 1) {
            if (event.key === "Enter") {
                addTask();
            }
        } else {
            if (event.key === "Enter") {
                updateTask();
            }
        }
    };

    const removeTask = (task) => {
        const updatedList = taskList.filter((t) => t.name !== task.name);
        setTaskList(updatedList);
    };

    const handleEditTask = (task, index) => {
        setEditTaskIndex(index); 
        setEditedTask(task.name);
    };

    const updateTask = () => {
        if (editedTask.trim() !== "") {
            const updatedList = [...taskList];
            updatedList[editTaskIndex] = { ...updatedList[editTaskIndex], name: editedTask }; 
            setTaskList(updatedList);
            setEditTaskIndex(null); 
            setEditedTask(""); 
        }
    };

    const toggleTaskStatus = (task) => {
        if (doneTasks.includes(task.name)) {
            const updatedList = doneTasks.filter((t) => t !== task.name);
            setDoneTasks(updatedList);
        } else {
            const updatedList = [...doneTasks, task.name];
            setDoneTasks(updatedList);
        }
    };

    const addDescription = (index) => {
        const updatedList = [...taskList];
        updatedList[index] = { ...updatedList[index], description: descriptionInput };
        setTaskList(updatedList);
        setDescriptionInput("");
    };

    const toggleDescriptionVisibility = (index) => {
        setShowDescriptions((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (!isHydrated) {
        return null; 
    }

    return (
        <div>
            <h2>Tasks for {date}</h2>
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
                                <button style = {{ borderRadius:"50%", width:"20px", height:"20px",backgroundColor:"pink"}} onClick={() => removeTask(task)}>-</button>
                                <span>{task.name}</span>
                                <button onClick={() => handleEditTask(task, index)}>Edit</button>
                                {doneTasks.includes(task.name) ? (
                                    <button
                                        style={{ color: "green", marginLeft: "10px" }}
                                        onClick={() => toggleTaskStatus(task)} 
                                    >
                                        &#10004; 
                                    </button>
                                ) : (
                                    <button onClick={() => toggleTaskStatus(task)}>Mark as done</button>
                                )}
                                <button onClick={() => toggleDescriptionVisibility(index)}>
                                    {showDescriptions[index] ? "Hide Description" : "Show Description"}
                                </button>
                                {showDescriptions[index] && (
                                    <div>
                                        <p>{task.description || "No description yet"}</p>
                                        <input
                                            type="text"
                                            placeholder="Add description"
                                            value={descriptionInput}
                                            onChange={(e) => setDescriptionInput(e.target.value)}
                                        />
                                        <button onClick={() => addDescription(index)}>Save</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
