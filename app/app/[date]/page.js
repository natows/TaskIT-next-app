"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../login/UserContext";
import DayEditing from "./DayEditing";
import { useRouter } from "next/navigation";
import React from "react";
import { format, addDays, subDays } from "date-fns";

export default function DayPage({ params }) {
    const { date } = React.use(params);
    const { user } = useContext(UserContext);
    const router = useRouter();

    const handlePreviousDay = () => {
        const previousDay = format(subDays(new Date(date), 1), "yyyy-MM-dd");
        router.push(`/${previousDay}`);
    };

    const handleNextDay = () => {
        const nextDay = format(addDays(new Date(date), 1), "yyyy-MM-dd");
        router.push(`/${nextDay}`);
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        router.push(`/${selectedDate}`);
    };

    if (!user) {
        return <p>Please log in to view and manage tasks.</p>;
    }

    return (
        <div className="p-6 min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
            <div className="flex justify-center items-center gap-5 mb-4">
                <button onClick={handlePreviousDay} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="border rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button onClick={handleNextDay} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <DayEditing />
        </div>
    );
}
