"use client";
import { useRef, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserContext"; 

export default function LoginPage() {
    const router = useRouter();
    const loginPrompt = useRef();
    const passwordPrompt = useRef();
    const { handleLogin } = useContext(UserContext); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    function loginOnClick() {
        const login = loginPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();

        if (!login || !password) {
            setErrorMessage("Please provide both username and password");
            return;
        }

        const result = handleLogin(login, password);
        if (result.success) {
            router.push("/");
        } else {
            setErrorMessage(result.message);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            loginOnClick();
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <div className="modal-content">
                <h2 className="text-2xl font-bold text-center mb-6">Log into your account</h2>

                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                <input
                    ref={loginPrompt}
                    type="text"
                    placeholder="Your username"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onKeyDown={handleKeyDown}
                />

                <input
                    ref={passwordPrompt}
                    type="password"
                    placeholder="Your password"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onKeyDown={handleKeyDown}
                />

                <button
                    onClick={loginOnClick}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Log in
                </button>
                <button onClick={() => router.push("/signin")} className="w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 mt-4">Don't have an account yet? Sign up</button>
            </div>
        </div>
    );
}
