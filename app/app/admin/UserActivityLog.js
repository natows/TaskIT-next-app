"use client";
import { useContext } from "react";
import { UserActivityContext } from "./UserActivityContext";

export default function UserActivityLog() {
    const { activityLog } = useContext(UserActivityContext);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg h-[300px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">User Activity Log</h2>
            <ul>
                {activityLog.slice().reverse().map((log, index) => (
                    <li key={index} className="mb-2">
                        <span>{formatTimestamp(log.timestamp)}: {log.user} - {log.action}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}