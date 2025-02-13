"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./login/UserContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(UserContext);

    const addNotification = (message, type = "info") => {
        const id = `${Date.now()}-${Math.random()}`;
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            { id, message, type, read: false },
        ]);
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    const markAllAsRead = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({ ...notification, read: true }))
        );
    };

    const addTask = (task, date) => {
        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };

        if (!parsedData.tasksByDate[date]) {
            parsedData.tasksByDate[date] = { tasks: [] };
        }

        parsedData.tasksByDate[date].tasks.push(task);
        localStorage.setItem(userId, JSON.stringify(parsedData));
    };

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

    useEffect(() => {
        if (user) {
            const userId = user.userId;
            const storedData = localStorage.getItem(userId);
            const parsedData = storedData ? JSON.parse(storedData) : {};
            parsedData.notifications = notifications;
            localStorage.setItem(userId, JSON.stringify(parsedData));
        }
    }, [notifications, user]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, markAllAsRead, addTask }}>
            {children}
        </NotificationContext.Provider>
    );
};