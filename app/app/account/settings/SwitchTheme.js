"use client"

import { useState, useEffect } from "react";

export default function SwitchTheme() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
    }, []); 

    function changeTheme() {
        const newTheme = theme === "light" ? "dark" : "light"; 
        setTheme(newTheme); 
        localStorage.setItem("theme", newTheme); 
    }

    return (
        <div>
            <button onClick={changeTheme} >
                Change to {theme === "light" ? "dark theme" : "light theme"}
            </button>
        </div>
    );
}