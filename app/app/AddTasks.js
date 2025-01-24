"use client";
import { useState, useEffect } from "react";

export default function AddTask() {
    const [taskName, setTaskName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [priority, setPriority] = useState("normal");
    const [description, setDescription] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleAddTask = () => {
        if (taskName.trim() === "") {
            alert("Please enter a task name.");
            return;
        }

        if (!startDate) {
            alert("Please enter a start date.");
            return;
        }

        if (!currentUser) {
            alert("No user is logged in.");
            return;
        }

        const newTask = {
            name: taskName,
            description,
            priority, 
            done: false, 
        };

        const storedUsers = localStorage.getItem("users");
        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : {};

        const user = parsedUsers[currentUser.username];

        if (!user) {
            alert("User data not found.");
            return;
        }

        user.tasks = user.tasks || {};
        if (!user.tasks[startDate]) {
            user.tasks[startDate] = { tasks: [] };
        }

        user.tasks[startDate].tasks.push(newTask);

        
        parsedUsers[currentUser.username] = user;
        localStorage.setItem("users", JSON.stringify(parsedUsers));

       
        setTaskName("");
        setStartDate("");
        setEndDate("");
        setPriority("normal"); 
        setDescription(""); 
    };

    return (
        <div>
            <h2>Add Task</h2>
            <div>
                <label>
                    Task Name:
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Enter task name"
                    />
                </label>
            </div>
            <div>
                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                    />
                </label>
            </div>
            <div>
                <label>
                    Priority:
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </label>
            </div>
            <button onClick={handleAddTask}>Add Task</button>
        </div>
    );
}
