"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { currentUser } from "../login/UserLogin.js";

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
        if (taskList.length === 0) {
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tasks for {date}</h2>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task"
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <button onClick={addTask} className="bg-blue-500 text-white py-2 px-4 rounded">Add task</button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Task List</h3>
            <ul>
                {taskList.map((task, index) => (
                    <li key={index} className="flex justify-between items-center mb-2 p-2 border rounded">
                        {editTaskIndex === index ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    className="border rounded p-2 mr-2"
                                />
                                <button onClick={updateTask} className="bg-green-500 text-white py-1 px-3 rounded">Update</button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <button
                                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2"
                                    onClick={() => removeTask(index)}
                                >
                                    -
                                </button>
                                <span className="flex-grow">{task.name}</span>
                                <button onClick={() => handleEditTask(task, index)} className="bg-yellow-500 text-white py-1 px-3 rounded mr-2">Edit</button>
                                {task.done ? (
                                    <button
                                        className="text-green-500 mr-2"
                                        onClick={() => toggleTaskStatus(task)}
                                    >
                                        &#10004;
                                    </button>
                                ) : (
                                    <button onClick={() => toggleTaskStatus(task)} className="bg-gray-300 text-black py-1 px-3 rounded mr-2">Mark as done</button>
                                )}
                                <button
                                    onClick={() => toggleDescriptionVisibility(index)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                >
                                    {showDescriptions[index] ? "Hide Description" : "Show Description"}
                                </button>
                                {showDescriptions[index] && (
                                    <div className="ml-4">
                                        <p className="mb-2">{task.description || "No description yet"}</p>
                                        <input
                                            type="text"
                                            placeholder="Add description"
                                            value={descriptionInput}
                                            onChange={(e) => setDescriptionInput(e.target.value)}
                                            className="border rounded p-2 mr-2"
                                        />
                                        <button onClick={() => addDescription(index)} className="bg-green-500 text-white py-1 px-3 rounded">Save</button>
                                    </div>
                                )}
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handlePrioritySet(index, "low")}
                                        className={`w-4 h-4 rounded-full ${task.priority === "low" ? "bg-yellow-500" : "bg-yellow-200"}`}
                                    ></button>
                                    <button
                                        onClick={() => handlePrioritySet(index, "normal")}
                                        className={`w-4 h-4 rounded-full ${task.priority === "normal" ? "bg-green-500" : "bg-green-200"}`}
                                    ></button>
                                    <button
                                        onClick={() => handlePrioritySet(index, "high")}
                                        className={`w-4 h-4 rounded-full ${task.priority === "high" ? "bg-red-500" : "bg-red-200"}`}
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
