"use client";
import { useEffect, useContext } from "react";
import { UserContext } from "./login/UserContext";
import Calendar from "./Calendar.js";
import CurrentTasks from "./CurrentTasks.js";
import BrowseTasks from "./BrowseTasks.js";
import AddTask from "./AddTasks.js";
import AdminPanel from "./admin/AdminPanel.js";
import BrowseDays from "./BrowseDays.js";

export default function HomePage() {
    const { user } = useContext(UserContext);

    const adminList = [
        { userId: "1", username: "admin1", password: "admin1pass", role: "admin" },
        { userId: "2", username: "admin2", password: "admin2pass", role: "admin" },
    ];

    useEffect(() => {
        const usersData = JSON.parse(localStorage.getItem("users")) || {};
        const adminsExist = adminList.some(admin => usersData[admin.username]);

        if (!adminsExist) {
            adminList.forEach((admin) => {
                usersData[admin.username] = admin;
            });
            localStorage.setItem("users", JSON.stringify(usersData));
        }
    }, []);

    return (
        <div className="p-4">
            {user !== null ? (
                user.isAdmin ? (
                    <AdminPanel />
                ) : (
                    <div>
                        <div className="flex gap-8 mb-4">
                            <div className="w-1/4 h-[300px]">
                                <AddTask />
                            </div>

                            <div className="w-1/4 flex flex-col justify-between h-[300px] gap-9">
                                <div className="h-[150px]">
                                    <BrowseTasks />
                                </div>
                                <div className="h-[150px] mt-5">
                                    <BrowseDays />
                                </div>
                            </div>

                            <div className="w-1/2 h-[300px]">
                                <CurrentTasks />
                            </div>
                        </div>

                        <div className="h-[calc(100vh-200px)] overflow-y-auto">
                            <Calendar />
                        </div>
                    </div>
                )
            ) : (
                <div>
                    <p>Welcome to TaskIt 😊</p>
                    <p>Please log in to see your tasks.</p>
                    <Calendar />
                </div>
            )}
        </div>
    );
}
