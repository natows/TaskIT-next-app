"use client";
import { useRef, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../login/UserContext";

export default function SignUpPage() {
    const router = useRouter();
    const emailPrompt = useRef();
    const passwordPrompt = useRef();
    const { handleRegister } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    function registerOnClick() {
        const email = emailPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();

        if (!email || !password) {
            setErrorMessage("Please provide both email and password");
            return;
        }

        const result = handleRegister(email, password);
        if (result.success) {
            router.push("/");
        } else {
            setErrorMessage(result.message);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            registerOnClick();
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <div className="modal-content max-w-sm w-full p-6">
                <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>

                {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

                <input
                    ref={emailPrompt}
                    type="email"
                    placeholder="Your email"
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
                    onClick={registerOnClick}
                    className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Sign up
                </button>
                <button onClick={() => router.push("/login")} className="w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 mt-4">Already have an account? Log in</button>
            </div>
        </div>
    );
}