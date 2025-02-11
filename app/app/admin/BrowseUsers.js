"use client";
import { useState, useEffect } from "react";
import EditUser from "./EditUser";
import UserTasksModal from "./UserTasksModal";

export default function BrowseUsers({ users, deleteUser, updateUser }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTasks, setUserTasks] = useState([]);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isUserTasksModalOpen, setIsUserTasksModalOpen] = useState(false);

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
        setIsUserTasksModalOpen(true);
    };

    const handleCloseTasks = () => {
        setSelectedUser(null);
        setUserTasks([]);
        setIsUserTasksModalOpen(false);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditUserModalOpen(true);
    };

    const handleCloseEditUser = () => {
        setIsEditUserModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div
                style={{
                    flexBasis: "100%",
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
                    <span style={{ flexBasis: "15%", textAlign: "left" }}>Username</span>
                    <span style={{ flexBasis: "15%", textAlign: "left" }}>Password</span>
                    <span style={{ flexBasis: "15%", textAlign: "left" }}>ID</span>
                    <span style={{ flexBasis: "15%", textAlign: "left" }}>Role</span>
                    <span style={{ flexBasis: "10%", textAlign: "center" }}>Edit</span>
                    <span style={{ flexBasis: "10%", textAlign: "center" }}>Tasks</span>
                    <span style={{ flexBasis: "10%", textAlign: "center" }}>Actions</span>
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
                                <span style={{ flexBasis: "15%", textAlign: "left" }}>{user.username}</span>
                                <span style={{ flexBasis: "15%", textAlign: "left" }}>{user.password}</span>
                                <span style={{ flexBasis: "15%", textAlign: "left" }}>{user.userId}</span>
                                <span style={{ flexBasis: "15%", textAlign: "left" }}>{user.role}</span>
                                <button
                                    style={{
                                        flexBasis: "10%",
                                        backgroundColor: "#4CAF50",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        marginRight: "5px",
                                    }}
                                    onClick={() => handleEditUser(user)}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button
                                    style={{
                                        flexBasis: "10%",
                                        backgroundColor: "#2196F3",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                        marginRight: "5px",
                                    }}
                                    onClick={() => handleSeeTasks(user)}
                                >
                                    <i className="fa-solid fa-list-check"></i>
                                </button>
                                <button
                                    onClick={() => deleteUser(user.username)}
                                    style={{
                                        flexBasis: "10%",
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "5px",
                                        cursor: "pointer",
                                        textAlign: "center",
                                    }}
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {isEditUserModalOpen && (
                <EditUser
                    user={selectedUser}
                    updateUser={updateUser}
                    onClose={handleCloseEditUser}
                />
            )}

            {isUserTasksModalOpen && (
                <UserTasksModal
                    user={selectedUser}
                    tasks={userTasks}
                    onClose={handleCloseTasks}
                />
            )}
        </div>
    );
}
