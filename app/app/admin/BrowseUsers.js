"use client";
import { useReducer, useEffect, useContext } from "react";
import { Box, Button, IconButton, InputBase, Paper, Select, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, List as ListIcon } from "@mui/icons-material";
import EditUser from "./EditUser";
import UserTasksModal from "./UserTasksModal";
import { UserContext } from "../login/UserContext";

const initialState = {
    searchTerm: "",
    roleFilter: "",
    selectedUser: null,
    userTasks: [],
    isEditUserModalOpen: false,
    isUserTasksModalOpen: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "SET_SEARCH_TERM":
            return { ...state, searchTerm: action.payload };
        case "SET_ROLE_FILTER":
            return { ...state, roleFilter: action.payload };
        case "SET_SELECTED_USER":
            return { ...state, selectedUser: action.payload };
        case "SET_USER_TASKS":
            return { ...state, userTasks: action.payload };
        case "TOGGLE_EDIT_USER_MODAL":
            return { ...state, isEditUserModalOpen: !state.isEditUserModalOpen };
        case "TOGGLE_USER_TASKS_MODAL":
            return { ...state, isUserTasksModalOpen: !state.isUserTasksModalOpen };
        case "RESET_SELECTED_USER":
            return { ...state, selectedUser: null, userTasks: [] };
        default:
            return state;
    }
}

export default function BrowseUsers({ users, deleteUser, updateUser }) {
    const { user } = useContext(UserContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    const currentUser = user;

    const filteredUsers = users.filter((user) => {
        const matchesUsername = user.username.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesRole = state.roleFilter ? user.role === state.roleFilter : true;
        const isNotCurrentUser = user.username !== currentUser?.username; 
        return matchesUsername && matchesRole && isNotCurrentUser;
    });

    useEffect(() => {
        if (state.selectedUser) {
            const tasksData = JSON.parse(localStorage.getItem(state.selectedUser.userId));

            if (tasksData && tasksData.tasksByDate) {
                const allTasks = Object.values(tasksData.tasksByDate)
                    .flatMap(dateGroup => dateGroup.tasks);
                dispatch({ type: "SET_USER_TASKS", payload: allTasks });
            } else {
                dispatch({ type: "SET_USER_TASKS", payload: [] });
            }
        }
    }, [state.selectedUser]);

    const handleSeeTasks = (user) => {
        dispatch({ type: "SET_SELECTED_USER", payload: user });
        dispatch({ type: "TOGGLE_USER_TASKS_MODAL" });
    };

    const handleCloseTasks = () => {
        dispatch({ type: "RESET_SELECTED_USER" });
        dispatch({ type: "TOGGLE_USER_TASKS_MODAL" });
    };

    const handleEditUser = (user) => {
        dispatch({ type: "SET_SELECTED_USER", payload: user });
        dispatch({ type: "TOGGLE_EDIT_USER_MODAL" });
    };

    const handleCloseEditUser = () => {
        dispatch({ type: "TOGGLE_EDIT_USER_MODAL" });
        dispatch({ type: "RESET_SELECTED_USER" });
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
                    value={state.searchTerm}
                    onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })}
                />
                <Select
                    value={state.roleFilter}
                    onChange={(e) => dispatch({ type: "SET_ROLE_FILTER", payload: e.target.value })}
                    sx={{ ml: 1 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
            </Paper>
            <TableContainer component={Paper} sx={{ maxHeight: 250 }}>
                <Table stickyHeader>
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

            {state.isEditUserModalOpen && (
                <EditUser
                    user={state.selectedUser}
                    updateUser={updateUser}
                    onClose={handleCloseEditUser}
                />
            )}

            {state.isUserTasksModalOpen && (
                <UserTasksModal
                    user={state.selectedUser}
                    tasks={state.userTasks}
                    onClose={handleCloseTasks}
                />
            )}
        </Box>
    );
}
