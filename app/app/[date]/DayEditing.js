"use client";
import { useReducer, useEffect, useContext, useMemo, lazy, Suspense } from "react";
import { useParams } from "next/navigation";
import { UserContext } from "../login/UserContext";
import { UserActivityContext } from "../admin/UserActivityContext";
const SortingTasks = lazy(() => import("./SortingTasks"));
const Attachments = lazy(() => import("./Attachments"));
import CommentModal from "./CommentModal";
import { NotificationContext } from "../NotificationContext";


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
    isCommentModalOpen: false,
    currentCommentTaskIndex: null,
    commentInput: "",
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
        case "OPEN_COMMENT_MODAL":
            return { ...state, isCommentModalOpen: true, currentCommentTaskIndex: action.taskIndex };
        case "CLOSE_COMMENT_MODAL":
            return { ...state, isCommentModalOpen: false, currentCommentTaskIndex: null, commentInput: "" };
        case "SET_COMMENT_INPUT":
            return { ...state, commentInput: action.value };
        default:
            return state;
    }
}

export default function DayEditing() {
    const { date } = useParams();
    const { user } = useContext(UserContext);
    const { logUserActivity } = useContext(UserActivityContext);
    const { addNotification } = useContext(NotificationContext);     const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (!user) return;
        const users = JSON.parse(localStorage.getItem("users")) || {};
        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };
    
        if (parsedData.tasksByDate[date]) {
            const taskList = parsedData.tasksByDate[date].tasks || [];
            const attachments = parsedData.tasksByDate[date].attachments || {};
    
            taskList.forEach(task => {
                if (task.sharedWith) {
                    Object.keys(task.sharedWith).forEach(sharedUsername => {
                        const sharedUser = Object.values(users).find(user => user.username === sharedUsername);
                        if (sharedUser) {
                            const sharedUserId = sharedUser.userId;
                            const sharedUserData = JSON.parse(localStorage.getItem(sharedUserId)) || { tasksByDate: {} };
                            const sharedUserComments = sharedUserData.tasksByDate[date]?.tasks.find(t => t.name === task.name)?.comments || [];
                            if (Array.isArray(task.comments)) {
                                task.comments = [...new Set([...task.comments, ...sharedUserComments])];
                            } else {
                                task.comments = [...new Set([...sharedUserComments])];
                            }
                        }
                    });
                }
            });
    
            dispatch({ type: "SET_TASK_LIST", taskList });
            dispatch({ type: "SET_ATTACHMENTS", attachments });
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

            if (newTask.priority === "high") {
                addNotification(`Task "${newTask.name}" with high priority is due today!`, "high");
            }
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

        if (updatedList.every(task => task.done)) {
            addNotification(`All tasks for ${date} are done!`, "success");
        }
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
    
        const updatedTask = { ...task, sharedWith: { ...task.sharedWith, [state.shareWithUsername]: true } };
        const updatedSharedTask = { ...task, sharedWith: { ...task.sharedWith, [user.username]: true } };
    
        const updatedTaskList = [...state.taskList];
        updatedTaskList[taskIndex] = updatedTask;
    
        dispatch({ type: "SET_TASK_LIST", taskList: updatedTaskList });
    
        sharedUserData.tasksByDate[date].tasks.push(updatedSharedTask);
        localStorage.setItem(sharedUserId, JSON.stringify(sharedUserData));
    
        const sharedUserComments = sharedUserData.tasksByDate[date].tasks.find(t => t.name === task.name)?.comments || [];
        const mergedComments = [...new Set([...task.comments, ...sharedUserComments])];
    
        updatedTaskList[taskIndex] = { ...updatedTaskList[taskIndex], comments: mergedComments };
        dispatch({ type: "SET_TASK_LIST", taskList: updatedTaskList });
    
        logUserActivity(`User ${user.username} shared task "${task.name}" with ${state.shareWithUsername}`);
        dispatch({ type: "SET_SHARE_MESSAGE", message: `Task "${task.name}" shared with ${state.shareWithUsername}` });
    };
    const openCommentModal = (taskIndex) => {
        dispatch({ type: "OPEN_COMMENT_MODAL", taskIndex });
    };

    const closeCommentModal = () => {
        dispatch({ type: "CLOSE_COMMENT_MODAL" });
    };

    const handleCommentInputChange = (e) => {
        dispatch({ type: "SET_COMMENT_INPUT", value: e.target.value });
    };

    const saveComment = () => {
        if (state.currentCommentTaskIndex !== null) {
            const updatedList = [...state.taskList];
            const task = updatedList[state.currentCommentTaskIndex];
            const comments = task.comments || [];
            const newComment = `${user.username}: ${state.commentInput}`;
            comments.push(newComment);
            updatedList[state.currentCommentTaskIndex] = {
                ...task,
                comments: comments
            };
            dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
            dispatch({ type: "SET_FIELD", field: "commentInput", value: "" }); 
        }
    };
    const deleteComment = (commentIndex) => {
        if (state.currentCommentTaskIndex !== null) {
            const updatedList = [...state.taskList];
            const task = updatedList[state.currentCommentTaskIndex];
            const comments = task.comments || [];
            comments.splice(commentIndex, 1);
            updatedList[state.currentCommentTaskIndex] = {
                ...task,
                comments: comments
            };
            dispatch({ type: "SET_TASK_LIST", taskList: updatedList });
        }
    };


    if (!user) {
        return <p>Please log in to manage tasks.</p>;
    }

    if (!state.isHydrated) {
        return null;
    }

    

    return (
        <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
            <h2 className="textt text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Tasks for {date}</h2>
            <Suspense fallback={<div>Loading...</div>}>
                <SortingTasks onSort={handleSort} />
            </Suspense>
            <div className="flex mb-6 items-center">
                <input
                    type="text"
                    value={state.newTask}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "newTask", value: e.target.value })}
                    placeholder="New task"
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                    className="border rounded-lg p-3 flex-grow mr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <select
                    value={state.priority}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "priority", value: e.target.value })}
                    className="border rounded-lg p-3 mr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
                <button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">Add task</button>
                <input
                    type="text"
                    value={state.searchQuery}
                    onChange={(e) => dispatch({ type: "SET_FIELD", field: "searchQuery", value: e.target.value })}
                    placeholder="Search tasks"
                    className="border rounded-lg p-3 flex-grow ml-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h3 className="textt text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Task List</h3>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} className="task-item flex justify-between items-center mb-4 p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                        <span className="textt flex-grow text-lg text-gray-800 dark:text-gray-200">{task.name}</span>
                        <div className="flex items-center justify-end gap-4">
                        {task.sharedWith ? (
                                <div className="relative group">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                        <i className="fa-solid fa-users"></i>
                                    </button>
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-sm rounded py-2 px-3">
                                        Shared with: {Object.keys(task.sharedWith).join(", ")}
                                    </div>
                                </div>
                            ) : null}
                            <button onClick={() => openCommentModal(index)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                <i className="fa-solid fa-comment"></i>
                            </button>
                            <button onClick={() => removeTask(index)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                            <button onClick={() => handleEditTask(task, index)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            {task.done ? (
                                <button
                                    className="bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => toggleTaskStatus(task)}
                                >
                                    <i className="fa-regular fa-circle-check"></i>
                                </button>
                            ) : (
                                <button onClick={() => toggleTaskStatus(task)} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                            )}
                            <button
                                onClick={() => handleDescriptionClick(index)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                {state.showDescriptions[index] ? <i className="fa-solid fa-x"></i> : <i className="fa-regular fa-note-sticky"></i>}
                            </button>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handlePrioritySet(index, "low")}
                                    className={`w-6 h-6 rounded-full ${task.priority === "low" ? "bg-yellow-400" : "bg-yellow-200"} shadow-md`}
                                ></button>
                                <button
                                    onClick={() => handlePrioritySet(index, "normal")}
                                    className={`w-6 h-6 rounded-full ${task.priority === "normal" ? "bg-green-500" : "bg-green-200"} shadow-md`}
                                ></button>
                                <button
                                    onClick={() => handlePrioritySet(index, "high")}
                                    className={`w-6 h-6 rounded-full ${task.priority === "high" ? "bg-red-500" : "bg-red-200"} shadow-md`}
                                ></button>
                            </div>
                            <Suspense fallback={<div>Loading...</div>}>
                                <Attachments taskIndex={index} attachments={state.attachments} setAttachments={(attachments) => dispatch({ type: "SET_ATTACHMENTS", attachments })} />
                            </Suspense>
                            <button onClick={() => openShareModal(index)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                <i className="fa-solid fa-share"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {state.isDescriptionModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="textt text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Edit Description</h2>
                        <textarea
                            value={state.descriptionInput}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "descriptionInput", value: e.target.value })}
                            className="border rounded-lg p-3 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            rows="4"
                        />
                        <button onClick={handleDescriptionSave} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Save
                        </button>
                        <button onClick={() => dispatch({ type: "SET_FIELD", field: "isDescriptionModalOpen", value: false })} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Close
                        </button>
                    </div>
                </div>
            )}
            {state.isEditTaskModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="textt text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Edit Task</h2>
                        <input
                            type="text"
                            value={state.editedTask}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "editedTask", value: e.target.value })}
                            className="border rounded-lg p-3 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button onClick={updateTask} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Save
                        </button>
                        <button onClick={() => dispatch({ type: "SET_FIELD", field: "isEditTaskModalOpen", value: false })} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Close
                        </button>
                    </div>
                </div>
            )}
            {state.isShareModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="modal-content bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="textt text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Share Task</h2>
                        <input
                            type="text"
                            value={state.shareWithUsername}
                            onChange={(e) => dispatch({ type: "SET_FIELD", field: "shareWithUsername", value: e.target.value })}
                            placeholder="Username to share with"
                            className="border rounded-lg p-3 w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button onClick={shareTask} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Share
                        </button>
                        <button onClick={closeShareModal} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Close
                        </button>
                        {state.shareMessage && <p className="mt-2 text-red-500">{state.shareMessage}</p>}
                    </div>
                </div>
            )}
            {state.isCommentModalOpen && (
                <CommentModal
                    comments={state.taskList[state.currentCommentTaskIndex]?.comments || []}
                    commentInput={state.commentInput}
                    onCommentInputChange={handleCommentInputChange}
                    onSaveComment={saveComment}
                    onClose={closeCommentModal}
                    onDeleteComment={deleteComment}
                    currentUser={user.username}
                />
            )}
        </div>
    );
}