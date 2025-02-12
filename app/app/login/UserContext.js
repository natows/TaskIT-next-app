"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { currentUser, logIn, logout, signIn } from "./UserLogin";
import { UserActivityContext } from "../admin/UserActivityContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { logUserActivity } = useContext(UserActivityContext);
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
            const userData = logIn(login, password, logUserActivity);
            setUser(userData);  
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleRegister = (email, password) => {
        try {
            const userData = signIn(email, password, logUserActivity);
            setUser(userData);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleLogout = () => {
        logout(logUserActivity);
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, handleLogin, handleRegister, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};
