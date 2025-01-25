"use client";
import { useState } from "react";

export default function BrowseUsers({ users, deleteUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState(""); 

    const filteredUsers = users.filter((user) => {
        const matchesUsername = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        return matchesUsername && matchesRole;
    });

    return (
        <div>
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
                <option value="user">User</option>
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
    );
}
