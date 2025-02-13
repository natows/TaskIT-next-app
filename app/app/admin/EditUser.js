"use client";
import { useState } from "react";
import { Box, Button, TextField, Typography, Modal, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function EditUser({ user, updateUser, onClose }) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [role, setRole] = useState(user.role);

    const handleSave = () => {
        const updatedUser = { ...user, username, password, role };
        updateUser(updatedUser);
        onClose();
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit User
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
                <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select value={role} onChange={(e) => setRole(e.target.value)}>
                        <MenuItem value="regular">Regular</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}