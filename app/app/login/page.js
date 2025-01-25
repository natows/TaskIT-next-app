"use client";
import { useRef } from "react";
import { logIn } from "./UserLogin.js";
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

        try {
            const user = logIn(login, password);

            if (user) {
                router.push("/");
            } else {
                alert("Invalid login credentials");
            }
        } catch (error) {
            alert(error.message);
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
