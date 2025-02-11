"use client";
import { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "info") => {
        const id = Date.now();
        setNotifications((prevNotifications) => [
            ...prevNotifications,
            { id, message, type },
        ]);
        setTimeout(() => {
            removeNotification(id);
        }, 5000); 
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};