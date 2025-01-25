"use client";
import { useState } from "react";

export default function CreateUser({ addUser }) { 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); 
    const [errorMessage, setErrorMessage] = useState(""); 

    const handleCreateUser = () => {
        if (!username || !password) {
            setErrorMessage("Username and password are required.");
            return;
        }

        const usersData = JSON.parse(localStorage.getItem("users")) || {};

        if (usersData[username]) {
            setErrorMessage("User already exists.");
            return;
        }

        const newUserId = Date.now().toString();

        const newUser = {
            userId: newUserId,
            username,
            password,
            role, 
        };

        usersData[username] = newUser;
        localStorage.setItem("users", JSON.stringify(usersData));

        localStorage.setItem(newUserId, JSON.stringify({ tasksByDate: {} }));

        setUsername("");
        setPassword("");
        setRole("user");
        setErrorMessage(""); 

        addUser(newUser); 

        alert("User created successfully!");
    };

    return (
        <div>
            <h2>Create New User</h2>

            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={role === "user"}
                        onChange={() => setRole("user")}
                    />
                    Regular User
                </label>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={role === "admin"}
                        onChange={() => setRole("admin")}
                    />
                    Admin
                </label>
            </div>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <button onClick={handleCreateUser}>Create User</button>
        </div>
    );
}
