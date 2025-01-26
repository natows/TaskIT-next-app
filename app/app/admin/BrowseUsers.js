"use client";
import { useState, useEffect } from "react";

export default function BrowseUsers({ users, deleteUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTasks, setUserTasks] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const filteredUsers = users.filter((user) => {
        const matchesUsername = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const isNotCurrentUser = user.username !== currentUser?.username; 
        return matchesUsername && matchesRole && isNotCurrentUser;
    });

    useEffect(() => {
        if (selectedUser) {
            const tasksData = JSON.parse(localStorage.getItem(selectedUser.userId));

            if (tasksData && tasksData.tasksByDate) {
                const allTasks = Object.values(tasksData.tasksByDate)
                    .flatMap(dateGroup => dateGroup.tasks);
                setUserTasks(allTasks);
            } else {
                setUserTasks([]);
            }
        }
    }, [selectedUser]);

    const handleSeeTasks = (user) => {
        setSelectedUser(user);
    };

    const handleCloseTasks = () => {
        setSelectedUser(null);
        setUserTasks([]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div
                style={{
                    flexBasis: selectedUser ? "50%" : "100%",
                    padding: "10px",
                    transition: "flex-basis 0.3s ease-in-out",
                }}
            >
                <h2>Browse Users</h2>

                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{
                        marginLeft: "10px",
                        padding: "5px",
                        fontSize: "14px",
                    }}
                >
                    <option value="">All</option>
                    <option value="regular">Regular</option>
                    <option value="admin">Admin</option>
                </select>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        borderBottom: "2px solid #ddd",
                        padding: "5px 10px",
                        marginBottom: "10px",
                    }}
                >
                    <span style={{ flexBasis: "20%", textAlign: "left" }}>Username</span>
                    <span style={{ flexBasis: "20%", textAlign: "left" }}>Password</span>
                    <span style={{ flexBasis: "20%", textAlign: "left" }}>ID</span>
                    <span style={{ flexBasis: "20%", textAlign: "left" }}>Role</span>
                    <span style={{ flexBasis: "20%", textAlign: "center" }}>Tasks</span>
                    <span style={{ flexBasis: "20%", textAlign: "center" }}>Actions</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {filteredUsers.length === 0 ? (
                        <li>No users found</li>
                    ) : (
                        filteredUsers.map((user) => (
                            <li
                                key={user.userId}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                }}
                            >
                                <span style={{ flexBasis: "20%", textAlign: "left" }}>{user.username}</span>
                                <span style={{ flexBasis: "20%", textAlign: "left" }}>{user.password}</span>
                                <span style={{ flexBasis: "20%", textAlign: "left" }}>{user.userId}</span>
                                <span style={{ flexBasis: "20%", textAlign: "left" }}>{user.role}</span>
                                <button
                                    style={{
                                        flexBasis: "20%",
                                        backgroundColor: "#2196F3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                    }}
                                    onClick={() => handleSeeTasks(user)}
                                >
                                    See tasks
                                </button>
                                <button
                                    onClick={() => deleteUser(user.username)}
                                    style={{
                                        flexBasis: "20%",
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                    }}
                                >
                                    Delete user
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {selectedUser && (
                <div
                    style={{
                        flexBasis: "50%",
                        padding: "10px",
                        transition: "flex-basis 0.3s ease-in-out",
                    }}
                >
                    <h3>Tasks for user: {selectedUser.username}</h3>
                    <button
                        onClick={handleCloseTasks}
                        style={{ backgroundColor: "#f44336", color: "white", padding: "5px 10px" }}
                    >
                        Close Tasks
                    </button>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {userTasks.length > 0 ? (
                            userTasks.map((task, index) => (
                                <li
                                    key={index}
                                    style={{
                                        marginBottom: "10px",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        padding: "5px 10px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <p>
                                        <strong>{task.name}</strong>
                                        <br />
                                        Status: {task.done ? <span>Done</span> : <span>Undone</span>}
                                        <br />
                                        Priority: <span>{task.priority}</span>
                                    </p>
                                    Description: {task.description ? (
                                        <span>{task.description}</span>
                                    ) : (
                                        <span>No description yet</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No tasks available for this user.</p>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
