"use client";
import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export default function Notifications() {
    const { notifications } = useContext(NotificationContext);

    return (
        <div className="fixed top-0 right-0 p-4 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-2 rounded shadow-lg ${
                        notification.type === "info"
                            ? "bg-blue-500 text-white"
                            : notification.type === "success"
                            ? "bg-green-500 text-white"
                            : notification.type === "error"
                            ? "bg-red-500 text-white"
                            : ""
                    }`}
                >
                    {notification.message}
                </div>
            ))}
        </div>
    );
}