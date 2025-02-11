"use client";
import { useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserContext"; 

export default function LoginPage() {
    const router = useRouter();
    const loginPrompt = useRef();
    const passwordPrompt = useRef();
    const { handleLogin } = useContext(UserContext); 

    function loginOnClick() {
        const login = loginPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();

        if (!login || !password) {
            alert("Please provide both username and password");
            return;
        }

        try {
            handleLogin(login, password); 
            router.push("/");
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
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Log into your account</h2>

                <input
                    ref={loginPrompt}
                    type="text"
                    placeholder="Your username"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={handleKeyDown}
                />

                <input
                    ref={passwordPrompt}
                    type="password"
                    placeholder="Your password"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={loginOnClick}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Log in
                </button>
            </div>
        </div>
    );
}
