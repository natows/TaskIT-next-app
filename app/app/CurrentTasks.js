"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./login/UserContext";

export default function CurrentTasks() {
    const { user } = useContext(UserContext);
    const [todaysTasks, setTodaysTasks] = useState([]);
    const [doneTasks, setDoneTasks] = useState([]);
    const [tomorrowsTasks, setTomorrowsTasks] = useState([]);
    const [doneTomorrowsTasks, setDoneTomorrowsTasks] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const userId = user.userId;
        const todaysDate = formatDate(new Date());
        const tomorrowsDate = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

        getTasks(userId, todaysDate, setTodaysTasks, setDoneTasks);
        getTasks(userId, tomorrowsDate, setTomorrowsTasks, setDoneTomorrowsTasks);
    }, [refresh, user]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getTasks = (userId, date, setTasks, setDoneTasks) => {
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (parsedData.tasksByDate[date]) {
            const allTasks = parsedData.tasksByDate[date].tasks || [];
            setTasks(allTasks.filter(task => !task.done));
            setDoneTasks(allTasks.filter(task => task.done));
        } else {
            setTasks([]);
            setDoneTasks([]);
        }
    };

    const toggleTaskStatus = (task, date) => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        const updatedTasks = parsedData.tasksByDate[date].tasks.map((t) =>
            t.name === task.name ? { ...t, done: !t.done } : t
        );

        parsedData.tasksByDate[date].tasks = updatedTasks;
        localStorage.setItem(userId, JSON.stringify(parsedData));

        if (date === formatDate(new Date())) {
            setTodaysTasks(updatedTasks.filter(task => !task.done));
            setDoneTasks(updatedTasks.filter(task => task.done));
        } else {
            setTomorrowsTasks(updatedTasks.filter(task => !task.done));
            setDoneTomorrowsTasks(updatedTasks.filter(task => task.done));
        }

        setRefresh(!refresh);
    };

    const handleTaskClick = (date) => {
        router.push(`/${date}`);
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="p-6 border border-gray-300 rounded-lg shadow-lg h-64 overflow-y-auto">
                <p className="text-xl font-semibold mb-4 cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date()))}>
                    Today's Tasks
                </p>
                {todaysTasks.length > 0 ? (
                    <ul>
                        {todaysTasks.map((task, index) => (
                            <li key={index} className="mb-2 flex justify-between items-center">
                                <span className="cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date()))}>
                                    {task.name}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleTaskStatus(task, formatDate(new Date()))}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Bummer! You have no tasks for today</p>
                )}
                {doneTasks.length > 0 && (
                    <>
                        <p className="font-semibold mt-4">Completed Tasks for Today:</p>
                        <ul>
                            {doneTasks.map((task, index) => (
                                <li key={index} className="mb-2 text-gray-500 line-through flex justify-between items-center">
                                    <span className="cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date()))}>
                                        {task.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTaskStatus(task, formatDate(new Date()))}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="p-6 border border-gray-300 rounded-lg shadow-lg h-64 overflow-y-auto">
                <p className="text-xl font-semibold mb-4 cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}>
                    Tomorrow's Tasks
                </p>
                {tomorrowsTasks.length > 0 ? (
                    <ul>
                        {tomorrowsTasks.map((task, index) => (
                            <li key={index} className="mb-2 flex justify-between items-center">
                                <span className="cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}>
                                    {task.name}
                                </span>
                                <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleTaskStatus(task, formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>A chill day! You have no tasks for tomorrow</p>
                )}
                {doneTomorrowsTasks.length > 0 && (
                    <>
                        <p className="font-semibold mt-4">Completed Tasks for Tomorrow:</p>
                        <ul>
                            {doneTomorrowsTasks.map((task, index) => (
                                <li key={index} className="mb-2 text-gray-500 line-through flex justify-between items-center">
                                    <span className="cursor-pointer" onClick={() => handleTaskClick(formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}>
                                        {task.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={task.done}
                                        onChange={() => toggleTaskStatus(task, formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000)))}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}
