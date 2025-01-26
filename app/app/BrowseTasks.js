"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "./login/UserLogin.js"; 

export default function BrowseTasks() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const user = currentUser(); 
        if (!user) return;
    
        const userId = user.userId; 
        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : {};
    
        const allTasks = Object.entries(parsedData.tasksByDate || {}).flatMap(([date, taskData]) =>
            taskData?.tasks ? taskData.tasks.map((task) => ({ ...task, date })) : []
        );
    
        const filtered = allTasks.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    
        setFilteredTasks(filtered);
        setIsVisible(searchQuery.length > 0);
    }, [searchQuery]);
    

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg">
            <input
                type="text"
                placeholder="Browse tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isVisible && (
                <ul
                    style={{
                        border: "1px solid #ccc",
                        maxHeight: "200px",
                        overflowY: "auto",
                        padding: "0",
                        margin: "5px 0",
                    }}
                >
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <li
                                key={index}
                                style={{ padding: "5px", cursor: "pointer" }}
                                onClick={() => setSearchQuery(task.name)}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span onClick={() => router.push(`/${task.date}`)}>
                                        {task.name}
                                    </span>
                                    <span style={{ color: "gray" }}>{task.date}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p style={{ padding: "5px" }}>No tasks found</p>
                    )}
                </ul>
            )}
        </div>
    );
}
