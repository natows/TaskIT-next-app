"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "./login/UserContext";

export default function Navigation() {
    const { user, handleLogout } = useContext(UserContext);

    const userToNull = () => {
        handleLogout();
    };

    return (
        <div className="flex justify-between items-center bg-blue-500 text-white p-3">
            <p className="text-2xl font-bold">TaskIt</p>
            {user !== null ? (
                <div className="flex items-center">
                    <p className="mr-4">{user.isAdmin ? `Welcome Admin ${user.username}` : `Welcome ${user.username}`}</p>
                    <button onClick={userToNull} className="bg-red-500 text-white py-1 px-4 rounded mr-2">Log out</button>
                    <Link href="/account">
                        Your account
                    </Link>
                </div>
            ) : (
                <Link href="/login" className="text-white text-lg">Log in</Link>
            )}
        </div>
    );
}