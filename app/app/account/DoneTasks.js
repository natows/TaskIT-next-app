"use client";
import { useState, useEffect, useMemo, useContext } from "react";
import { UserContext } from "../login/UserContext";

export default function DoneTasks() {
    const { user } = useContext(UserContext);
    const [availableDates, setAvailableDates] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(""); 
    const [doneTasks, setDoneTasks] = useState([]); 
    const [isDisplayed, setIsDisplayed] = useState(false); 

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
        <div>
            <h2>Your Done Tasks</h2>
            <select onChange={handleDateChange} value={selectedDate}>
                <option value="">Select a date</option>
                {availableDates.map((date, index) => (
                    <option key={index} value={date}>
                        {date}
                    </option>
                ))}
            </select>

            {isDisplayed && (
                <ul>
                    {doneTasks.length > 0 ? (
                        doneTasks.map((task, index) => (
                            <li key={index}>
                                <button onClick={() => removeTask(task)} className="bg-red-500 text-white py-1 px-3 rounded mr-2"><i className="fa-solid fa-trash"></i></button>
                                <span>{task.name}</span>
                            </li>
                        ))
                    ) : (
                        <p>No tasks done for this date.</p>
                    )}
                </ul>
            )}
        </div>
    );
}
