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
            <p>Home</p>
            {user !== null ? (
                (user.isAdmin)  ? (
                    <>
                        <p>Welcome Admin {initialUser.username}!</p>
                        <button onClick={userToNull}>Log out</button>
                        {/* <Link href="/account"><i className="fas fa-user"></i></Link> */}
                        <AdminPanel />
                    </>
                ) : (
                    <>
                        <p>Welcome {initialUser.username}!</p>
                        <button onClick={userToNull}>Log out</button>
                        <Link href="/account"><i className="fas fa-user"></i></Link>
                        <BrowseTasks />
                        <p>Get your day started!</p>
                        <CurrentTasks />
                        <AddTask />
                        <Calendar />
                    </>
                )
            ) : (
                <>
                    <Link href="/login">Log in</Link>
                </>
            )}
        </>
    );
}
