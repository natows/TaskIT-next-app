"use client";
import { useState, useEffect, useContext } from "react";
import { Box, Button, IconButton, InputBase, Paper, Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, List as ListIcon } from "@mui/icons-material";
import EditUser from "./EditUser";
import UserTasksModal from "./UserTasksModal";
import { UserContext } from "../login/UserContext";

export default function BrowseUsers({ users, deleteUser, updateUser }) {
    const { user } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userTasks, setUserTasks] = useState([]);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isUserTasksModalOpen, setIsUserTasksModalOpen] = useState(false);

    const currentUser = user;

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
        <Box>
            <Typography variant="h6" gutterBottom>
                Browse Users
            </Typography>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    sx={{ ml: 1 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
            </Paper>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell align="center">Edit</TableCell>
                            <TableCell align="center">Tasks</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No users found</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleEditUser(user)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleSeeTasks(user)} color="primary">
                                            <ListIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => deleteUser(user.username)} color="secondary">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
        </Box>
    );
}
