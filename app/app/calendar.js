import { useState, useEffect } from 'react';
import Link from "next/link"

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [month, setMonth] = useState(currentDate.getMonth());
    const [year, setYear] = useState(currentDate.getFullYear());

    useEffect(() => {
        const lastDayOfMonth = new Date(year, month + 1, 0); 

        const daysInMonth = [];
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            daysInMonth.push(i);
        }

        setDaysInMonth(daysInMonth);
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

    const initialDate = () => {
        const now = new Date();
        setMonth(now.getMonth());
        setYear(now.getFullYear());
        setCurrentDate(now);
    };

    const getFirstDayOfMonth = () => {
        const firstDay = new Date(year, month, 1);
        return firstDay.getDay(); 
    };

    const generateEmptyCells = () => {
        const firstDay = getFirstDayOfMonth();
        const emptyCells = [];
        const offset = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < offset; i++) {
            emptyCells.push(<div className="empty-cell" key={`empty-${i}`} />);
        }
        return emptyCells;
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={previousMonth}>Previous</button>
                <select value={month} onChange={handleMonthChange}>
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
                    style={{ width: '80px' }}
                />
                <button onClick={nextMonth}>Next</button>
                <button onClick={initialDate}>Current date</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div className="weekday" key={index}>{day}</div>
                ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}
            >
                {generateEmptyCells()}
                {daysInMonth.map((day) => {
                    const selectedDate = new Date(year, month, day); 
                    const formattedDate = selectedDate.toLocaleDateString('en-CA'); 

                    return (
                        <Link href={`/${formattedDate}`} className="calendar-day" key={day}>
                            {day}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
