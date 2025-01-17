"use client"
import {useState, useEffect} from "react"
export default function CurrentTasks(){
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [tommorowsTasks, setTommorowsTasks] = useState([]);
    useEffect(() => {
        const todaysDate = formatDate(new Date());
        const tommorowsDate = formatDate(new Date(Date.now() + 24*60*60*1000));
        getTasks(todaysDate, setTodaysTasks);
        getTasks(tommorowsDate, setTommorowsTasks);        
    },[]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }


    const getTasks = (date, setTasks) => { 
        const storedTasks = localStorage.getItem("tasksByDate")
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        if (parsedTasks[date]) {
            setTasks(parsedTasks[date].tasks || []);
            setDoneTasks(parsedTasks[date].doneTasks)
        } else {
            setTasks([]);
            setDoneTasks([]);
        }

    };


    return (
        <div>
            <p>Todays tasks</p>
            {todaysTasks.length > 0 ? (
                <ul>
                    {todaysTasks.map((task, index) => (
                        <li key={index}>{task.name}</li> 
                    ))}
                </ul>
            ) :
            (
                <p>Bummer! You have no tasks for today</p>
            )}
            <p>Tommorows Tasks</p>
            {tommorowsTasks.length > 0 ? (
                <ul>
                    {tommorowsTasks.map((task, index) => (
                        <li key={index}>{task.name}</li> 
                    ))}
                </ul>
            ) :
            (
                <p>A chiiill dayyy! You have no tasks for tommorow</p>
            )}
        </div>
    );
};