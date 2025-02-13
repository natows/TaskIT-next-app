"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./login/UserContext";

export default function BrowseTasks() {
    const { user } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : {};

        const allTasks = Object.entries(parsedData.tasksByDate || {}).flatMap(([date, taskData]) =>
            taskData?.tasks ? taskData.tasks.map((task) => ({ ...task, date })) : []
        );

        const filtered = allTasks.filter((task) => {
            const matchesSearchQuery = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || task.date.includes(searchQuery);
            const matchesStatus = statusFilter === "" || (statusFilter === "done" && task.done) || (statusFilter === "undone" && !task.done);
            const matchesPriority = priorityFilter === "" || task.priority === priorityFilter;
            const matchesDate = dateFilter === "" || task.date === dateFilter;

            return matchesSearchQuery && matchesStatus && matchesPriority && matchesDate;
        });

        setFilteredTasks(filtered);
        setIsVisible(searchQuery.length > 0 || statusFilter !== "" || priorityFilter !== "" || dateFilter !== "");
    }, [searchQuery, statusFilter, priorityFilter, dateFilter, user]);

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg">
            <input
                type="text"
                placeholder="Browse tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="flex flex-col gap-2 mb-2">
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded p-2 flex-grow"
                    >
                        <option value="">Status</option>
                        <option value="done">Done</option>
                        <option value="undone">Undone</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="border rounded p-2 flex-grow"
                    >
                        <option value="">Priority</option>
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border rounded p-2"
                />
            </div>
            {isVisible && (
                <ul className="border border-gray-300 overflow-y-auto p-0 mt-2 bg-white task-list">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-100 bg-white task-list-item"
                                onClick={() => setSearchQuery(task.name)}
                            >
                                <div className="flex flex-col">
                                    <span onClick={() => router.push(`/${task.date}`)} className="font-semibold">
                                        {task.name}
                                    </span>
                                    <span className="text-gray-500 text-sm">{task.date}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="p-2 bg-white task-list-item">No tasks found</p>
                    )}
                </ul>
            )}
        </div>
    );
}
