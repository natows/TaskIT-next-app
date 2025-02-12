"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./login/UserContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { user } = useContext(UserContext);

    const addNotification = (message, type = "info") => {
        const id = `${Date.now()}-${Math.random()}`;
        console.log(`Adding notification: ${message}, type: ${type}, id: ${id}`);
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            { id, message, type },
        ]);
    };

    const removeNotification = (id) => {
        console.log(`Removing notification with id: ${id}`);
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const addTask = (task, date) => {
        setTasks((prevTasks) => [
            ...prevTasks,
            { ...task, date },
        ]);
    };

    const checkTasksForNotifications = () => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {}, sentNotifications: {} };
        const sentNotifications = parsedData.sentNotifications || {};

        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const todayTasks = parsedData.tasksByDate[today] ? parsedData.tasksByDate[today].tasks : [];
        const tomorrowTasks = parsedData.tasksByDate[tomorrowStr] ? parsedData.tasksByDate[tomorrowStr].tasks : [];

        console.log(`Today's tasks:`, todayTasks);
        console.log(`Tomorrow's tasks:`, tomorrowTasks);

        todayTasks.forEach(task => {
            if (task.priority === "high") {
                const taskExistsTomorrow = tomorrowTasks.some(t => 
                    t.name === task.name && 
                    t.priority === task.priority && 
                    t.description === task.description
                );

                if (!taskExistsTomorrow && !sentNotifications[task.name]) {
                    console.log(`Task "${task.name}" with high priority is due today!`);
                    addNotification(`Task "${task.name}" with high priority is due today!`, "high");
                    sentNotifications[task.name] = true;
                }
            }
        });

        const allTasksDone = todayTasks.length > 0 && todayTasks.every(task => task.done);
        if (allTasksDone && !sentNotifications['allTasksDone']) {
            console.log('All tasks for today are done!');
            addNotification('All tasks for today are done!', 'success');
            sentNotifications['allTasksDone'] = true;
        }

        parsedData.sentNotifications = sentNotifications;
        localStorage.setItem(userId, JSON.stringify(parsedData));
    };

    useEffect(() => {
        console.log('Checking tasks for notifications...');
        checkTasksForNotifications();
    }, [user]);

    useEffect(() => {
        if (user) {
            const userId = user.userId;
            const storedData = localStorage.getItem(userId);
            const parsedData = storedData ? JSON.parse(storedData) : { notifications: [] };
            setNotifications(parsedData.notifications || []);
        } else {
            setNotifications([]);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, addTask, tasks }}>
            {children}
        </NotificationContext.Provider>
    );
};