"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../login/UserContext";
import DayEditing from "./DayEditing";
import { useRouter } from "next/navigation";
import React from "react";

export default function DayPage({ params }) {
    const { date } = React.use(params);
    const { user } = useContext(UserContext);
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/login'); 
    };

    return (
        <>
            <Link href="/">Go back</Link>
            
            {user ? (
                <Link href="/account">Your Profile</Link> 
            ) : (
                <button onClick={handleLoginRedirect}>Log in</button>
            )}

            <DayEditing />
        </>
    );
}
