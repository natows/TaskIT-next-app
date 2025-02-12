"use client";
import { useReducer, useEffect, useContext, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../login/UserContext";
import { UserActivityContext } from "../admin/UserActivityContext";
import SortingTasks from "./SortingTasks";
import Attachments from "./Attachments";

const initialState = {
    taskList: [],
    newTask: "",
    priority: "normal",
    searchQuery: "",
    editTaskIndex: null,
    editedTask: "",
    descriptionInput: "",
    showDescriptions: {},
    attachments: {},
    isHydrated: false,
    isDescriptionModalOpen: false,
    currentDescriptionIndex: null,
    isEditTaskModalOpen: false,
    sortCriteria: "",
    isShareModalOpen: false,
    taskToShareIndex: null,
    shareWithUsername: "",
    shareMessage: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "SET_TASK_LIST":
            return { ...state, taskList: action.taskList };
        case "SET_ATTACHMENTS":
            return { ...state, attachments: action.attachments };
        case "RESET":
            return initialState;
        case "OPEN_SHARE_MODAL":
            return { ...state, isShareModalOpen: true, taskToShareIndex: action.taskIndex };
        case "CLOSE_SHARE_MODAL":
            return { ...state, isShareModalOpen: false, taskToShareIndex: null, shareWithUsername: "", shareMessage: "" };
        case "SET_SHARE_MESSAGE":
            return { ...state, shareMessage: action.message };
        default:
            return state;
    }
}

export default function DayEditing() {
    const { date } = useParams();
    const { user } = useContext(UserContext);
    const { logUserActivity } = useContext(UserActivityContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (parsedData.tasksByDate[date]) {
            dispatch({ type: "SET_TASK_LIST", taskList: parsedData.tasksByDate[date].tasks || [] });
            dispatch({ type: "SET_ATTACHMENTS", attachments: parsedData.tasksByDate[date].attachments || {} });
        }

        dispatch({ type: "SET_FIELD", field: "isHydrated", value: true });
    }, [date, user]);

    useEffect(() => {
        if (!user || !state.isHydrated) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        parsedData.tasksByDate[date] = { tasks: state.taskList, attachments: state.attachments };
        localStorage.setItem(userId, JSON.stringify(parsedData));
    }, [state.taskList, state.attachments, state.isHydrated, date, user]);

    const addTask = () => {
        if (state.newTask.trim() !== "") {
            const newTask = { name: state.newTask, description: "", priority: state.priority, done: false };
            dispatch({
                type: "SET_TASK_LIST",
                taskList: [...state.taskList, newTask]
            });
            dispatch({ type: "SET_FIELD", field: "newTask", value: "" });
            dispatch({ type: "SET_FIELD", field: "priority", value: "normal" });
            logUserActivity(`User ${user.username} created a task: "${newTask.name}"`);
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
        const taskName = state.taskList[index].name;
        const updatedList = state.taskList.filter((_, i) => i !== index);
        dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
        logUserActivity(`User ${user.username} removed a task: "${taskName}"`);
        if (state.taskList.length === 0) {
            const userId = user.userId;
            const storedData = localStorage.getItem(userId);
            const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

            delete parsedData.tasksByDate[date];

            localStorage.setItem(userId, JSON.stringify(parsedData));
        }
    };

    const handleEditTask = (task, index) => {
        dispatch({ type: "SET_FIELD", field: "editTaskIndex", value: index });
        dispatch({ type: "SET_FIELD", field: "editedTask", value: task.name });
        dispatch({ type: "SET_FIELD", field: "isEditTaskModalOpen", value: true });
    };

    const updateTask = () => {
        if (state.editedTask.trim() !== "") {
            const oldTaskName = state.taskList[state.editTaskIndex].name;
            const updatedList = [...state.taskList];
            updatedList[state.editTaskIndex] = { ...updatedList[state.editTaskIndex], name: state.editedTask };
            dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
            dispatch({ type: "SET_FIELD", field: "editTaskIndex", value: null });
            dispatch({ type: "SET_FIELD", field: "editedTask", value: "" });
            dispatch({ type: "SET_FIELD", field: "isEditTaskModalOpen", value: false });
            logUserActivity(`User ${user.username} changed task "${oldTaskName}" to "${state.editedTask}"`);
        }
    };

    const toggleTaskStatus = (task) => {
        const updatedList = state.taskList.map((t) =>
            t.name === task.name
                ? { ...t, done: !t.done }
                : t
        );
        dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
        logUserActivity(`User ${user.username} marked task "${task.name}" as ${task.done ? "not done" : "done"}`);
    };

    const addDescription = (index) => {
        const updatedList = [...state.taskList];
        updatedList[index] = { ...updatedList[index], description: state.descriptionInput };
        dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
        dispatch({ type: "SET_FIELD", field: "descriptionInput", value: "" });
    };

    const toggleDescriptionVisibility = (index) => {
        dispatch({
            type: "SET_FIELD",
            field: "showDescriptions",
            value: { ...state.showDescriptions, [index]: !state.showDescriptions[index] }
        });
    };

    const handlePrioritySet = (index, level) => {
        const updatedList = [...state.taskList];
        updatedList[index] = { ...updatedList[index], priority: level };
        dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
    };

    const handleSort = (criteria) => {
        dispatch({ type: "SET_FIELD", field: "sortCriteria", value: criteria });
    };

    const sortedTasks = useMemo(() => {
        let sortedList = [...state.taskList];
        if (state.sortCriteria === "name-asc") {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (state.sortCriteria === "name-desc") {
            sortedList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (state.sortCriteria === "priority-high-low") {
            const priorityOrder = { low: 1, normal: 2, high: 3 };
            sortedList.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        } else if (state.sortCriteria === "priority-low-high") {
            const priorityOrder = { low: 1, normal: 2, high: 3 };
            sortedList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (state.sortCriteria === "status") {
            sortedList.sort((a, b) => a.done - b.done);
        }
        return sortedList;
    }, [state.taskList, state.sortCriteria]);

    const filteredTasks = useMemo(() => {
        return sortedTasks.filter((task) =>
            task.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }, [sortedTasks, state.searchQuery]);

    const handleDescriptionClick = (index) => {
        dispatch({ type: "SET_FIELD", field: "currentDescriptionIndex", value: index });
        dispatch({ type: "SET_FIELD", field: "descriptionInput", value: state.taskList[index].description || "" });
        dispatch({ type: "SET_FIELD", field: "isDescriptionModalOpen", value: true });
    };

    const handleDescriptionSave = () => {
        if (state.currentDescriptionIndex !== null) {
            addDescription(state.currentDescriptionIndex);
            dispatch({ type: "SET_FIELD", field: "isDescriptionModalOpen", value: false });
        }
    };

    const openShareModal = (taskIndex) => {
        dispatch({ type: "OPEN_SHARE_MODAL", taskIndex });
    };

    const closeShareModal = () => {
        dispatch({ type: "CLOSE_SHARE_MODAL" });
    };

    const shareTask = () => {
        const taskIndex = state.taskToShareIndex;
        const task = state.taskList[taskIndex];
        const users = JSON.parse(localStorage.getItem("users")) || {};
        const sharedUser = Object.values(users).find(user => user.username === state.shareWithUsername);

        if (!sharedUser) {
            dispatch({ type: "SET_SHARE_MESSAGE", message: "User not found" });
            return;
        }

        const sharedUserId = sharedUser.userId;
        const sharedUserData = JSON.parse(localStorage.getItem(sharedUserId)) || { tasksByDate: {} };

        if (!sharedUserData.tasksByDate[date]) {
            sharedUserData.tasksByDate[date] = { tasks: [], attachments: {} };
        }

        sharedUserData.tasksByDate[date].tasks.push(task);
        localStorage.setItem(sharedUserId, JSON.stringify(sharedUserData));

        logUserActivity(`User ${user.username} shared task "${task.name}" with ${state.shareWithUsername}`);
        dispatch({ type: "SET_SHARE_MESSAGE", message: `Task "${task.name}" shared with ${state.shareWithUsername}` });
    };

    if (!user) {
        return <p>Please log in to manage tasks.</p>;
    }

    if (!state.isHydrated) {
        return null;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Tasks for {date}</h2>
            <SortingTasks onSort={handleSort} />
            <div className="flex mb-4">
                <input
                    type="text"
                    value={state.newTask}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "newTask", value: e.target.value })}
                    placeholder="New task"
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className="border rounded p-2 flex-grow mr-2"
                />
                <select
                    value={state.priority}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "priority", value: e.target.value })}
                    className="border rounded p-2 mr-2"
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <button onClick={addTask} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Add task</button>
                <input
                    type="text"
                    value={state.searchQuery}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "searchQuery", value: e.target.value })}
                    placeholder="Search tasks"
                    className="border rounded p-2 flex-grow"
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task List</h3>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} className="flex justify-between items-center mb-2 p-2 border rounded">
                        {state.editTaskIndex === index ? (
                            <div className="flex items-center w-full justify-end">
                                <input
                                    type="text"
                                    value={state.editedTask}
                                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "editedTask", value: e.target.value })}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    className="border rounded p-2 mr-2"
                                />
                                <button onClick={updateTask} className="bg-green-500 text-white py-1 px-3 rounded">Update</button>
                            </div>
                        ) : (
                            <div className="flex items-center w-full justify-between">
                                <span className="flex-grow" style={{ fontSize: '1.3rem' }}>{task.name}</span>
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
                                        {state.showDescriptions[index] ? <i className="fa-solid fa-x"></i> : <i className="fa-regular fa-note-sticky"></i>}
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
                                    <Attachments taskIndex={index} attachments={state.attachments} setAttachments={(attachments) => dispatch({ type: "SET_ATTACHMENTS", attachments })} />
                                    <button onClick={() => openShareModal(index)} className="bg-blue-500 text-white py-1 px-3 rounded"><i className="fa-solid fa-share"></i></button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            {state.isDescriptionModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Edit Description</h2>
                        <textarea
                            value={state.descriptionInput}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "descriptionInput", value: e.target.value })}
                            className="border rounded p-2 w-full mb-4"
                            rows="4"
                        />
                        <button onClick={handleDescriptionSave} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                            Save
                        </button>
                        <button onClick={() => dispatch({ type: "SET_FIELD", field: "isDescriptionModalOpen", value: false })} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
            {state.isEditTaskModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <input
                            type="text"
                            value={state.editedTask}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "editedTask", value: e.target.value })}
                            className="border rounded p-2 w-full mb-4"
                        />
                        <button onClick={updateTask} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                            Save
                        </button>
                        <button onClick={() => dispatch({ type: "SET_FIELD", field: "isEditTaskModalOpen", value: false })} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
            {state.isShareModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="text-xl font-bold mb-4">Share Task</h2>
                        <input
                            type="text"
                            value={state.shareWithUsername}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "shareWithUsername", value: e.target.value })}
                            placeholder="Username to share with"
                            className="border rounded p-2 w-full mb-4"
                        />
                        <button onClick={shareTask} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                            Share
                        </button>
                        <button onClick={closeShareModal} className="bg-gray-500 text-white py-2 px-4 rounded">
                            Close
                        </button>
                        {state.shareMessage && <p className="mt-2 text-red-500">{state.shareMessage}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
