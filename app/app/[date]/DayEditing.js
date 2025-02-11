"use client";
import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../login/UserContext";
import SortingTasks from "./SortingTasks";
import Attachments from "./Attachments";

export default function DayEditing() {
    const { date } = useParams();
    const { user } = useContext(UserContext);
    const [taskList, setTaskList] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [priority, setPriority] = useState("normal");
    const [searchQuery, setSearchQuery] = useState("");
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [showDescriptions, setShowDescriptions] = useState({});
    const [attachments, setAttachments] = useState({});
    const [isHydrated, setIsHydrated] = useState(false);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(null);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (parsedData.tasksByDate[date]) {
            setTaskList(parsedData.tasksByDate[date].tasks || []);
            setAttachments(parsedData.tasksByDate[date].attachments || {});
        }

        setIsHydrated(true);
    }, [date, user]);

    useEffect(() => {
        if (!user || !isHydrated) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        parsedData.tasksByDate[date] = { tasks: taskList, attachments: attachments };
        localStorage.setItem(userId, JSON.stringify(parsedData));
    }, [taskList, attachments, isHydrated, date, user]);

    const addTask = () => {
        if (newTask.trim() !== "") {
            setTaskList([
                ...taskList,
                { name: newTask, description: "", priority: priority, done: false }
            ]);
            setNewTask("");
            setPriority("normal");
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
            const userId = user.userId;
            const storedData = localStorage.getItem(userId);
            const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

            delete parsedData.tasksByDate[date];

            localStorage.setItem(userId, JSON.stringify(parsedData));
        }
    };

    const handleEditTask = (task, index) => {
        setEditTaskIndex(index);
        setEditedTask(task.name);
        setIsEditTaskModalOpen(true);
    };

    const updateTask = () => {
        if (editedTask.trim() !== "") {
            const updatedList = [...taskList];
            updatedList[editTaskIndex] = { ...updatedList[editTaskIndex], name: editedTask };
            setTaskList(updatedList);
            setEditTaskIndex(null);
            setEditedTask("");
            setIsEditTaskModalOpen(false);
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

    const handleSort = (criteria) => {
        let sortedList = [...taskList];
        if (criteria === "name-asc") {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === "name-desc") {
            sortedList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (criteria === "priority-high-low") {
            const priorityOrder = { low: 1, normal: 2, high: 3 };
            sortedList.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        } else if (criteria === "priority-low-high") {
            const priorityOrder = { low: 1, normal: 2, high: 3 };
            sortedList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (criteria === "status") {
            sortedList.sort((a, b) => a.done - b.done);
        }
        setTaskList(sortedList);
    };

    const filteredTasks = taskList.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDescriptionClick = (index) => {
        setCurrentDescriptionIndex(index);
        setDescriptionInput(taskList[index].description || "");
        setIsDescriptionModalOpen(true);
    };

    const handleDescriptionSave = () => {
        if (currentDescriptionIndex !== null) {
            addDescription(currentDescriptionIndex);
            setIsDescriptionModalOpen(false);
        }
    };

    if (!user) {
        return <p>Please log in to manage tasks.</p>;
    }

    if (!isHydrated) {
        return null;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tasks for {date}</h2>
            <SortingTasks onSort={handleSort} />
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task"
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border rounded p-2 mr-2"
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <button onClick={addTask} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Add task</button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks"
                    className="border rounded p-2 flex-grow"
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task List</h3>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} className="flex justify-between items-center mb-2 p-2 border rounded">
                        {editTaskIndex === index ? (
                            <div className="flex items-center w-full justify-end">
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
                            <div className="flex items-center w-full justify-between">
                                <span className="flex-grow">{task.name}</span>
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => removeTask(index)} className="bg-red-500 text-white py-1 px-3 rounded mr-2"><i className="fa-solid fa-trash"></i></button>
                                    <button onClick={() => handleEditTask(task, index)} className="bg-yellow-500 text-white py-1 px-3 rounded mr-2"><i className="fa-solid fa-pen"></i></button>
                                    {task.done ? (
                                        <button
                                            className="bg-green-300 text-black py-1 px-3 rounded mr-2"
                                            onClick={() => toggleTaskStatus(task)}
                                        >
                                            <i className="fa-regular fa-circle-check"></i>
                                        </button>
                                    ) : (
                                        <button onClick={() => toggleTaskStatus(task)} className="bg-gray-300 text-black py-1 px-3 rounded mr-2"><i className="fa-solid fa-circle-xmark"></i></button>
                                    )}
                                    <button
                                        onClick={() => handleDescriptionClick(index)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                    >
                                        {showDescriptions[index] ? <i className="fa-solid fa-x"></i> : <i className="fa-regular fa-note-sticky"></i>}
                                    </button>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handlePrioritySet(index, "low")}
                                            className={`w-4 h-4 rounded-full ${task.priority === "low" ? "bg-yellow-400" : "bg-yellow-200"}`}
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
                                    <Attachments taskIndex={index} attachments={attachments} setAttachments={setAttachments} />
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {isDescriptionModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Edit Description</h2>
                        <textarea
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            className="border rounded p-2 w-full mb-4"
                            rows="4"
                        />
                        <button onClick={handleDescriptionSave} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                            Save
                        </button>
                        <button onClick={() => setIsDescriptionModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
            {isEditTaskModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <input
                            type="text"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                            className="border rounded p-2 w-full mb-4"
                        />
                        <button onClick={updateTask} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                            Save
                        </button>
                        <button onClick={() => setIsEditTaskModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
