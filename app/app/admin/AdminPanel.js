"use client";
import { useState, useEffect, useCallback } from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import BrowseUsers from "./BrowseUsers";
import CreateUser from "./CreateUsers";
import UserActivityLog from "./UserActivityLog";

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
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Admin Panel
            </Typography>
            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ height: '100%' }}>
                        <Box p={2}>
                            <CreateUser addUser={addUser} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ height: '100%' }}>
                        <Box p={2}>
                            <BrowseUsers users={users} deleteUser={deleteUser} updateUser={updateUser} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3}>
                        <Box p={2}>
                            <UserActivityLog />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
