"use client";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button onClick={toggleTheme} className="bg-primary text-white py-1 px-4 rounded">
            {theme === "light" ? "Dark theme" : "Light theme"}
        </button>
    );
}