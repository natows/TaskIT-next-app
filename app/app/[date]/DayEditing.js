"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { currentUser } from "../login/user.js"; 

export default function DayEditing() {
    const { date } = useParams(); 
    const [taskList, setTaskList] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [showDescriptions, setShowDescriptions] = useState({});
    const [isHydrated, setIsHydrated] = useState(false);


    const user = currentUser();
    if (!user) {
        return <p>Please log in to manage tasks.</p>;
    }
    const userId = user.userId; 

    
    useEffect(() => {
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (parsedData.tasksByDate[date]) {
            setTaskList(parsedData.tasksByDate[date].tasks || []);
        }

        setIsHydrated(true);
    }, [date, userId]);

    
    useEffect(() => {
        if (isHydrated) {
            const storedData = localStorage.getItem(userId);
            const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

            parsedData.tasksByDate[date] = { tasks: taskList };
            localStorage.setItem(userId, JSON.stringify(parsedData));
        }
    }, [taskList, isHydrated, date, userId]);

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTaskList([
                ...taskList,
                { name: newTask, description: "", priority: "normal", done: false }
            ]);
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

    const removeTask = (index) => {
        const updatedList = taskList.filter((_, i) => i !== index);
        setTaskList(updatedList);
        if (taskList.length === 0){
            const storedData = localStorage.getItem(userId);    
            const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

            delete parsedData.tasksByDate[date];

            localStorage.setItem(userId, JSON.stringify(parsedData));
        }
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
        const updatedList = taskList.map((t) =>
            t.name === task.name
                ? { ...t, done: !t.done }
                : t
        );
        setTaskList(updatedList);
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

    const handlePrioritySet = (index, level) => {
        const updatedList = [...taskList];
        updatedList[index] = { ...updatedList[index], priority: level };
        setTaskList(updatedList);
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
                    <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <button
                                    style={{
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "pink",
                                        marginRight: "10px",
                                    }}
                                    onClick={() => removeTask(index)}
                                >
                                    -
                                </button>
                                <span>{task.name}</span>
                                <button onClick={() => handleEditTask(task, index)} style={{ marginLeft: "10px" }}>
                                    Edit
                                </button>
                                {task.done ? (
                                    <button
                                        style={{ color: "green", marginLeft: "10px" }}
                                        onClick={() => toggleTaskStatus(task)}
                                    >
                                        &#10004;
                                    </button>
                                ) : (
                                    <button onClick={() => toggleTaskStatus(task)}>Mark as done</button>
                                )}
                                <button
                                    onClick={() => toggleDescriptionVisibility(index)}
                                    style={{ marginLeft: "10px" }}
                                >
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

                                <div style={{ display: "flex", gap: "10px", marginLeft: "10px" }}>
                                    <button
                                        onClick={() => handlePrioritySet(index, "low")}
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            backgroundColor: task.priority === "low" ? "yellow" : "#fdf9b1",
                                            textAlign: "center",
                                            lineHeight: "20px",
                                        }}
                                    ></button>
                                    <button
                                        onClick={() => handlePrioritySet(index, "normal")}
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            backgroundColor: task.priority === "normal" ? "#6ffd2a" : "#c3fdb1",
                                            textAlign: "center",
                                            lineHeight: "20px",
                                        }}
                                    ></button>
                                    <button
                                        onClick={() => handlePrioritySet(index, "high")}
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            backgroundColor: task.priority === "high" ? "#fe623e" : "#fdbfb1",
                                            textAlign: "center",
                                            lineHeight: "20px",
                                        }}
                                    ></button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
