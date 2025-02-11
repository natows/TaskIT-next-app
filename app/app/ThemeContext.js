"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "light";
            console.log("Initial theme:", savedTheme);
            return savedTheme;
        }
        return "light";
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            console.log("Setting theme in localStorage:", theme);
            localStorage.setItem("theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            console.log("Toggling theme to:", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};