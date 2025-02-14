"use client";
import { useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../login/UserContext";

export default function DoneTasks() {
    const { user } = useContext(UserContext);
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [doneTasks, setDoneTasks] = useState([]);
    const [isDisplayed, setIsDisplayed] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); 

    if (!user) {
        return <p>Please log in to view done tasks.</p>;
    }

    const userId = user.userId;

    const parsedTasks = useMemo(() => {
        const storedTasks = localStorage.getItem(userId);
        return storedTasks ? JSON.parse(storedTasks).tasksByDate : {};
    }, [userId]);

    const datesWithDoneTasks = useMemo(() => {
        return Object.keys(parsedTasks).filter((date) =>
            parsedTasks[date]?.tasks?.some((task) => task.done)
        );
    }, [parsedTasks]);

    useEffect(() => {
        setAvailableDates(datesWithDoneTasks);
    }, [datesWithDoneTasks]);

    const getDoneTaskList = useMemo(() => {
        if (!selectedDate) return [];
        const tasksForDate = parsedTasks[selectedDate]?.tasks || [];
        return tasksForDate.filter((task) => task.done);
    }, [parsedTasks, selectedDate]);

    useEffect(() => {
        setDoneTasks(getDoneTaskList);
    }, [getDoneTaskList]);

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        setIsDisplayed(true);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredTasks = useMemo(() => {
        return doneTasks.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [doneTasks, searchQuery]);

    const removeTask = (taskToRemove) => {
        const updatedTasks = parsedTasks[selectedDate]?.tasks.map((task) =>
            task.name === taskToRemove.name ? { ...task, done: false } : task
        );

        if (parsedTasks[selectedDate]) {
            parsedTasks[selectedDate].tasks = updatedTasks;
            localStorage.setItem(userId, JSON.stringify({ tasksByDate: parsedTasks }));
            setDoneTasks(updatedTasks.filter((task) => task.done));
        }
    };

    return (
        <div className="p-6 min-h-[50vh] bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
            <h2 className="textt text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Your Done Tasks</h2>
            <div className="flex mb-6 items-center">
                <select onChange={handleDateChange} value={selectedDate} className="border rounded-lg p-3 mr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Select a date</option>
                    {availableDates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search tasks"
                    className="border rounded-lg p-3 flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {isDisplayed && (
                <ul className="space-y-4">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <li key={index} className="task-item flex justify-between items-center p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                <span className="textt text-lg text-gray-800 dark:text-gray-200">{task.name}</span>
                                <button onClick={() => removeTask(task)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-gray-700 dark:text-gray-300">No tasks done for this date.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
