"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "./login/UserContext";
import { NotificationContext } from "./NotificationContext";
import ThemeSwitcher from "./ThemeSwitcher";
import Notifications from "./Notifications";

export default function Navigation() {
    const { user, handleLogout } = useContext(UserContext);
    const { notifications } = useContext(NotificationContext);
    const [showNotifications, setShowNotifications] = useState(false);

    const userToNull = () => {
        handleLogout();
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="nav flex justify-between items-center bg-blue-500 text-white p-3 relative">
            <Link href="/" className="text-2xl font-bold">TaskIt</Link>
            <div className="flex items-center">
                <ThemeSwitcher />
                {user !== null ? (
                    <div className="flex items-center ml-4">
                        <p className="mr-4">{user.isAdmin ? `Welcome Admin ${user.username}` : `Welcome ${user.username}`}</p>
                        <button onClick={userToNull} className="bg-red-500 text-white py-1 px-4 rounded mr-2">Log out</button>
                        {!user.isAdmin && (
                            <div><Link href="/account">
                            <i className="fa-solid fa-user"></i>
                            </Link>
                            <button onClick={toggleNotifications} className="relative ml-4">
                                <i className="fa-solid fa-bell"></i>
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            </div>
                        )}
                        {showNotifications && !user.isAdmin && (
                            <div className="notif absolute top-12 right-0 bg-white text-black p-4 rounded shadow-lg w-64 z-10">
                                <Notifications />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="text-white text-lg ml-4">Log in</Link>
                )}
            </div>
        </div>
    );
}