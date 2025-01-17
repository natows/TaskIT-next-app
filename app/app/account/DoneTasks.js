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
        const datesWithDoneTasks = Object.keys(parsedTasks).filter(
            (date) => parsedTasks[date].doneTasks && parsedTasks[date].doneTasks.length > 0
        );
        setAvailableDates(datesWithDoneTasks);
    };

    const getDoneTaskList = (date) => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        if (parsedTasks[date]) {
            setDoneTasks(parsedTasks[date].doneTasks || []);
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
            const updatedDoneTasks = parsedTasks[selectedDate].doneTasks.filter(
                (task) => task !== taskToRemove
            );
            parsedTasks[selectedDate].doneTasks = updatedDoneTasks;
            localStorage.setItem("tasksByDate", JSON.stringify(parsedTasks));
            setDoneTasks(updatedDoneTasks);
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
                                <span>{task}</span>
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
