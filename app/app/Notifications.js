"use client";
import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export default function Notifications() {
    const { notifications, removeNotification } = useContext(NotificationContext);

    console.log('Rendering notifications:', notifications);

    return (
        <div className="space-y-2">
            {notifications.length === 0 ? (
                <div className="p-2 rounded shadow-lg bg-gray-200 text-black">
                    No recent notifications
                </div>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-2 rounded shadow-lg ${
                            notification.type === "info"
                                ? "bg-blue-500 text-white"
                                : notification.type === "success"
                                ? "bg-green-500 text-white"
                                : notification.type === "error"
                                ? "bg-red-500 text-white"
                                : notification.type === "high"
                                ? "bg-red-500 text-white"
                                : ""
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <span>{notification.message}</span>
                            <button onClick={() => removeNotification(notification.id)} className="ml-4 text-white">
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}