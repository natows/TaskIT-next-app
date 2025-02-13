"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";

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
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleCreateUser();
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Create New User
            </Typography>
            <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
            />
            <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Role</FormLabel>
                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
                    <FormControlLabel value="user" control={<Radio />} label="Regular User" />
                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
            </FormControl>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Button variant="contained" color="primary" onClick={handleCreateUser} sx={{ mt: 2 }}>
                Create User
            </Button>
        </Box>
    );
}
