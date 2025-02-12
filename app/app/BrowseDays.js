"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BrowseDays() {
    const [date, setDate] = useState("");
    const router = useRouter();

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (date) {
            router.push(`/${date}`);
        }
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="border rounded p-2 mr-2 flex-grow"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Go
                </button>
            </form>
        </div>
    );
}