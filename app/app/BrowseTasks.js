"use client"
import {useState, useEffect} from "react"
export default function BrowseTasks(){
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTasks ,setFilteredTasks] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};
        const allTasks = Object.entries(parsedTasks).flatMap(([date, data]) =>
            data.tasks.map((task) => ({ ...task, date }))
        );
        const filtered = allTasks.filter((task) =>
            task.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTasks(filtered);
        setIsVisible(searchQuery.length > 0);
    }, [searchQuery]);

    return (
        <div>
            <input 
            type="text" placeholder="Browse tasks"
            value = {searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}/>
            {isVisible && (
                <ul style={{ border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto", padding: "0", margin: "5px 0" }}>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <li key={index} style={{ padding: "5px", cursor: "pointer" }} onClick={() => setSearchQuery(task.name)}>
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    <span onClick={() => window.location.href=`/${task.date}`}>{task.name}</span>
                                    <span style={{color:"gray", }}>{task.date}</span>
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
};