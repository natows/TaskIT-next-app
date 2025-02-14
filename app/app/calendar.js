"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from "next/link";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());

    const daysInMonth = useMemo(() => {
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const days = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(i);
        }
        return days;
    }, [month, year]);

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value, 10);
        setMonth(newMonth);
        setCurrentDate(new Date(year, newMonth, 1));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value, 10);
        setYear(newYear);
        setCurrentDate(new Date(newYear, month, 1));
    };

    const previousMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setMonth(newDate.getMonth());
        setYear(newDate.getFullYear());
        setCurrentDate(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setMonth(newDate.getMonth());
        setYear(newDate.getFullYear());
        setCurrentDate(newDate);
    };

    const initialDate = useCallback(() => {
        const now = new Date();
        setMonth(now.getMonth());
        setYear(now.getFullYear());
        setCurrentDate(now);
    }, []);

    const getFirstDayOfMonth = () => {
        const firstDay = new Date(year, month, 1);
        return firstDay.getDay(); 
    };

    const generateEmptyCells = () => {
        const firstDay = getFirstDayOfMonth();
        const emptyCells = [];
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < offset; i++) {
            emptyCells.push(<div className="w-full h-16 bg-transparent" key={`empty-${i}`} />);
        }
        return emptyCells;
    };

    return (
        <div className="calendar-dark bg-white rounded-lg shadow-lg p-6 border border-gray-300">
            <div className="calendar-header flex justify-between items-center mb-4">
                <button onClick={previousMonth} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    Previous
                </button>
                <div className="flex items-center space-x-4">
                    <select value={month} onChange={handleMonthChange} className="border rounded-md p-2">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <option value={index} key={index}>
                                {new Date(0, index).toLocaleString('en-CA', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={year}
                        onChange={handleYearChange}
                        className="border rounded-md p-2 w-20"
                    />
                </div>
                <button onClick={nextMonth} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    Next
                </button>
                <button onClick={initialDate} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                    Current Date
                </button>
            </div>
            
            <div className="calendar-days grid grid-cols-7 gap-2 text-center font-semibold mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={index} >{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {generateEmptyCells()}
                {daysInMonth.map((day) => {
                    const selectedDate = new Date(year, month, day); 
                    const formattedDate = selectedDate.toLocaleDateString('en-CA'); 

                    return (
                        <Link href={`/${formattedDate}`} key={day}>
                            <div className="calendar-day flex items-center justify-center w-14 h-14 rounded-full bg-blue-200 hover:bg-blue-300 cursor-pointer transition">
                                <span >{day}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
