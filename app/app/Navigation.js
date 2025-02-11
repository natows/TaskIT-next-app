"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "./login/UserContext";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navigation() {
    const { user, handleLogout } = useContext(UserContext);

    const userToNull = () => {
        handleLogout();
    };

    return (
        <div className="nav flex justify-between items-center bg-blue-500 text-white p-3">
            <Link href="/" className="text-2xl font-bold">TaskIt</Link>
            <div className="flex items-center">
                <ThemeSwitcher />
                {user !== null ? (
                    <div className="flex items-center ml-4">
                        <p className="mr-4">{user.isAdmin ? `Welcome Admin ${user.username}` : `Welcome ${user.username}`}</p>
                        <button onClick={userToNull} className="bg-red-500 text-white py-1 px-4 rounded mr-2">Log out</button>
                        <Link href="/account">
                        <i className="fa-solid fa-user"></i>
                        </Link>
                    </div>
                ) : (
                    <Link href="/login" className="text-white text-lg ml-4">Log in</Link>
                )}
            </div>
        </div>
    );
}