"use client";
import Link from "next/link";
import { currentUser } from "../login/UserLogin.js";  
import DayEditing from "./DayEditing";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";

export default function DayPage({ params }) {
    const { date } = React.use(params);
    const user = currentUser();  
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date(date));

    const handleLoginRedirect = () => {
        router.push('/login'); 
    };

    const handlePreviousDay = () => {
        const newDate = subDays(selectedDate, 1);
        setSelectedDate(newDate);
        router.push(`/${format(newDate, 'yyyy-MM-dd')}`);
    };

    const handleNextDay = () => {
        const newDate = addDays(selectedDate, 1);
        setSelectedDate(newDate);
        router.push(`/${format(newDate, 'yyyy-MM-dd')}`);
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setSelectedDate(newDate);
        router.push(`/${format(newDate, 'yyyy-MM-dd')}`);
    };

    return (
        <div className="p-4">
            <Link href="/" className="text-blue-500 hover:underline">Go back</Link>
            
            {user ? (
                <Link href="/account" className="text-blue-500 hover:underline ml-4">Your Profile</Link> 
            ) : (
                <button onClick={handleLoginRedirect} className="bg-blue-500 text-white py-2 px-4 rounded ml-4">Log in</button>
            )}

            <div className="flex items-center my-4">
                <button onClick={handlePreviousDay} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">Previous Day</button>
                <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    className="border rounded p-2"
                />
                <button onClick={handleNextDay} className="bg-blue-500 text-white py-2 px-4 rounded ml-2">Next Day</button>
            </div>

            <DayEditing date={format(selectedDate, 'yyyy-MM-dd')} />
        </div>
    );
}
