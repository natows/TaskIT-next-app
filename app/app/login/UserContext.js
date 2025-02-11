"use client";
import React, { createContext, useState, useEffect } from "react";
import { currentUser, logIn, logout } from "./UserLogin";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => currentUser());

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(currentUser());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogin = (login, password) => {
        try {
            const userData = logIn(login, password);
            setUser(userData);  
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, handleLogin, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};
