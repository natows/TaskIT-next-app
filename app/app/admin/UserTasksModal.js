"use client";

export default function UserTasksModal({ user, tasks, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Tasks for user: {user.username}</h3>
                <button
                    onClick={onClose}
                    style={{ backgroundColor: "#f44336", color: "white", padding: "5px 10px" }}
                >
                    Close Tasks
                </button>
                <ul style={{ listStyle: "none", padding: 0, maxHeight: "60vh", overflowY: "auto" }}>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <li
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    padding: "5px 10px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <p>
                                    <strong>{task.name}</strong>
                                    <br />
                                    Status: {task.done ? <span>Done</span> : <span>Undone</span>}
                                    <br />
                                    Priority: <span>{task.priority}</span>
                                </p>
                                Description: {task.description ? (
                                    <span>{task.description}</span>
                                ) : (
                                    <span>No description yet</span>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No tasks available for this user.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}