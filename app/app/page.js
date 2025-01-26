"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { currentUser, logout } from "./login/UserLogin.js";
import Calendar from "./Calendar.js";
import CurrentTasks from "./CurrentTasks.js";
import BrowseTasks from "./BrowseTasks.js";
import AddTask from "./AddTasks.js";
import AdminPanel from "./admin/AdminPanel.js";

export default function HomePage() {
    const adminList = [
        { userId: "1", username: "admin1", password: "admin1pass", role: "admin" },
        { userId: "2", username: "admin2", password: "admin2pass", role: "admin" },
    ];

    const initialUser = currentUser();
    const [user, setUser] = useState(initialUser);

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

    useEffect(() => {
        if (user === null) {
            logout();
        }
    }, [user]);

    const userToNull = () => {
        setUser(null);
        logout();
    };

    return (
        <>
            <div className="flex justify-between items-center bg-blue-500 text-white p-3">
                <p className="text-2xl font-bold">TaskIt</p>
                {user !== null ? (
                    <div className="flex items-center">
                        <p className="mr-4">{user.isAdmin ? `Welcome Admin ${initialUser.username}` : `Welcome ${initialUser.username}`}</p>
                        <button onClick={userToNull} className="bg-red-500 text-white py-1 px-4 rounded mr-2">Log out</button>
                        <Link href="/account">
                            <i className="fas fa-user text-xl cursor-pointer"></i>
                        </Link>
                    </div>
                ) : (
                    <Link href="/login" className="text-white text-lg">Log in</Link>
                )}
            </div>

            <div className="p-4">
                {user !== null ? (
                    user.isAdmin ? (
                        <AdminPanel />
                    ) : (
                        <div>
                            <div className="flex gap-8 mb-4">
                                <div className="w-1/4">
                                    <AddTask />
                                </div>

                                <div className="w-1/4">
                                    <BrowseTasks />
                                </div>

                                <div className="w-1/2 h-[300px] overflow-y-auto">
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
                        <p>Welcome to TaskIt &#128515;</p>
                        <p>Please log in to see your tasks.</p>
                        <Calendar />
                    </div>
                )}
            </div>
        </>
    );
}
