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
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousDay} className="bg-blue-500 text-white py-1 px-4 rounded">Previous Day</button>
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="border rounded p-2"
                />
                <button onClick={handleNextDay} className="bg-blue-500 text-white py-1 px-4 rounded">Next Day</button>
            </div>
            <DayEditing />
        </div>
    );
}
