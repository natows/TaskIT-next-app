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
        const result = logIn(login, password, logUserActivity);
        if (result.success) {
            setUser(result.userData);
            return { success: true };
        } else {
            return { success: false, message: result.message };
        }
    };

    const handleRegister = (email, password) => {
        const result = signIn(email, password, logUserActivity);
        if (result.success) {
            setUser(result.userData);
            return { success: true };
        } else {
            return { success: false, message: result.message };
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
