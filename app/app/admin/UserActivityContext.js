"use client";
import { createContext, useState, useEffect } from "react";

export const UserActivityContext = createContext();

export const UserActivityProvider = ({ children }) => {
    const [activityLog, setActivityLog] = useState([]);
    useEffect(() => {
        const storedActivityLog = JSON.parse(localStorage.getItem("activityLog")) || [];
        setActivityLog(storedActivityLog);
    }, []);

    const logUserActivity = (action) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser) return;
        const newLog = { user: currentUser.username, action, timestamp: new Date().toISOString() };
        const updatedActivityLog = [...activityLog, newLog];

        setActivityLog(updatedActivityLog);
        localStorage.setItem("activityLog", JSON.stringify(updatedActivityLog));
    };

    return (
        <UserActivityContext.Provider value={{ activityLog, logUserActivity }}>
            {children}
        </UserActivityContext.Provider>
    );
};