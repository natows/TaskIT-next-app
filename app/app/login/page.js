"use client";
import { useRef } from "react";
import { logIn, currentUser } from "./user.js"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const loginPrompt = useRef();
    const passwordPrompt = useRef();

    function loginOnClick() {
        const login = loginPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();

        if (!login || !password) {
            alert("Please provide both username and password");
            return;
        }

        const user = logIn(login, password);

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/"); 
        } else {
            alert("Invalid login credentials");
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            loginOnClick();
        }
    }

    return (
        <div>
            <h2>Log into your account</h2>
            <input
                ref={loginPrompt}
                type="text"
                placeholder="Your username"
                onKeyDown={handleKeyDown}
            />
            <input
                ref={passwordPrompt}
                type="password"
                placeholder="Your password"
                onKeyDown={handleKeyDown}
            />
            <button onClick={loginOnClick}>Log in</button>
        </div>
    );
}