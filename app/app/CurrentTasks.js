"use client";
import { useState, useEffect } from "react";
import { currentUser } from "./login/UserLogin.js"; 

export default function CurrentTasks() {
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [tommorowsTasks, setTommorowsTasks] = useState([]);

    useEffect(() => {
        const user = currentUser(); 
        if (!user) return; 

        const userId = user.userId;
        const todaysDate = formatDate(new Date());
        const tommorowsDate = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

        getTasks(userId, todaysDate, setTodaysTasks);
        getTasks(userId, tommorowsDate, setTommorowsTasks);
    }, []);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getTasks = (userId, date, setTasks) => {
        const storedData = localStorage.getItem(userId); 
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (parsedData.tasksByDate[date]) {
            const allTasks = parsedData.tasksByDate[date].tasks || [];
            setTasks(allTasks);

            if (date === formatDate(new Date())) { 
                const completed = allTasks.filter((task) => task.done);
                setDoneTasks(completed);
            }
        } else {
            setTasks([]);
            if (date === formatDate(new Date())) {
                setDoneTasks([]);
            }
        }
    };

    return (
        <div>
            <p>Today's Tasks</p>
            {todaysTasks.length > 0 ? (
                <ul>
                    {todaysTasks.map((task, index) => (
                        <li key={index}>{task.name}</li>
                    ))}
                </ul>
            ) : (
                <p>Bummer! You have no tasks for today</p>
            )}
            {doneTasks.length > 0 && (
                <>
                    <p>Completed Tasks for Today:</p>
                    <ul>
                        {doneTasks.map((task, index) => (
                            <li key={index} style={{ textDecoration: "line-through" }}>
                                {task.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <p>Tomorrow's Tasks</p>
            {tommorowsTasks.length > 0 ? (
                <ul>
                    {tommorowsTasks.map((task, index) => (
                        <li key={index}>{task.name}</li>
                    ))}
                </ul>
            ) : (
                <p>A chill day! You have no tasks for tomorrow</p>
            )}
        </div>
    );
}
