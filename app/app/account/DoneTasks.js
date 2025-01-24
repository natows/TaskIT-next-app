"use client";
import { useState, useEffect } from "react";

export default function DoneTasks() {
    const [availableDates, setAvailableDates] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(""); 
    const [doneTasks, setDoneTasks] = useState([]); 
    const [isDisplayed, setIsDisplayed] = useState(false); 

    const fetchAvailableDates = () => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        const datesWithDoneTasks = Object.keys(parsedTasks).filter((date) => 
            parsedTasks[date].tasks && 
            parsedTasks[date].tasks.some((task) => task.done) 
        );
        setAvailableDates(datesWithDoneTasks);
    };

    
    const getDoneTaskList = (date) => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        if (parsedTasks[date]) {
            const tasksForDate = parsedTasks[date].tasks || [];
            const doneTasksForDate = tasksForDate.filter((task) => task.done); 
            setDoneTasks(doneTasksForDate);
        } else {
            setDoneTasks([]);
        }
    };

    const handleDateChange = (event) => {
        const date = event.target.value; 
        setSelectedDate(date);
        getDoneTaskList(date); 
        setIsDisplayed(true);
    };

    const removeTask = (taskToRemove) => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        if (parsedTasks[selectedDate]) {
            const updatedTasks = parsedTasks[selectedDate].tasks.map((task) =>
                task.name === taskToRemove.name ? { ...task, done: false } : task 
            );
            parsedTasks[selectedDate].tasks = updatedTasks;
            localStorage.setItem("tasksByDate", JSON.stringify(parsedTasks));
            setDoneTasks(updatedTasks.filter((task) => task.done)); 
        }
    };

    useEffect(() => {
        fetchAvailableDates();
    }, []);

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
                                <button
                                    style={{
                                        borderRadius: "50%",
                                        backgroundColor: "pink",
                                        width: "20px",
                                        height: "20px",
                                    }}
                                    onClick={() => removeTask(task)}
                                >
                                    -
                                </button>
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
