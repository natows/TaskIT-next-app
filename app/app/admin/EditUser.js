"use client";
import { useState } from "react";

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
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit User</h2>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label>
                    Role:
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="regular">Regular</option>
                        <option value="admin">Admin</option>
                    </select>
                </label>
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}