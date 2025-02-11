"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./login/UserContext";

export default function BrowseTasks() {
    const { user } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : {};

        const allTasks = Object.entries(parsedData.tasksByDate || {}).flatMap(([date, taskData]) =>
            taskData?.tasks ? taskData.tasks.map((task) => ({ ...task, date })) : []
        );

        const filtered = allTasks.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.date.includes(searchQuery)
        );

        setFilteredTasks(filtered);
        setIsVisible(searchQuery.length > 0);
    }, [searchQuery, user]);

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg">
            <input
                type="text"
                placeholder="Browse tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
            {isVisible && (
                <ul className="border border-gray-300 max-h-48 overflow-y-auto p-0 mt-2">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => setSearchQuery(task.name)}
                            >
                                <div className="flex justify-between">
                                    <span onClick={() => router.push(`/${task.date}`)}>
                                        {task.name}
                                    </span>
                                    <span className="text-gray-500">{task.date}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="p-2">No tasks found</p>
                    )}
                </ul>
            )}
        </div>
    );
}
