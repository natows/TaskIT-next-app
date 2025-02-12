"use client";
import { useState, useEffect, useCallback } from "react";
import BrowseUsers from "./BrowseUsers";
import CreateUser from "./CreateUsers";

export default function AdminPanel() {
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(() => {
        const usersData = JSON.parse(localStorage.getItem("users")) || {};
        const userList = Object.values(usersData).sort((a, b) => a.username.localeCompare(b.username));
        setUsers(userList);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = useCallback((newUser) => {
        const usersData = JSON.parse(localStorage.getItem("users")) || {};
        usersData[newUser.username] = newUser;
        localStorage.setItem("users", JSON.stringify(usersData));
        fetchUsers(); 
    }, [fetchUsers]);

    const deleteUser = useCallback((username) => {
        const usersData = JSON.parse(localStorage.getItem("users")) || {};
        delete usersData[username];
        localStorage.setItem("users", JSON.stringify(usersData));
        fetchUsers(); 
    }, [fetchUsers]);

    const updateUser = useCallback((updatedUser) => {
        const usersData = JSON.parse(localStorage.getItem("users")) || {};
        usersData[updatedUser.username] = updatedUser;
        localStorage.setItem("users", JSON.stringify(usersData));
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div>
            <h1>Admin Panel</h1>
            <CreateUser addUser={addUser} /> 
            <BrowseUsers users={users} deleteUser={deleteUser} updateUser={updateUser} />
        </div>
    );
}
