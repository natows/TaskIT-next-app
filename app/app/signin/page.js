"use client";
import { useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../login/UserContext";

export default function SignUpPage() {
    const router = useRouter();
    const emailPrompt = useRef();
    const passwordPrompt = useRef();
    const { handleRegister } = useContext(UserContext);

    function registerOnClick() {
        const email = emailPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();

        if (!email || !password) {
            alert("Please provide both email and password");
            return;
        }

        try {
            handleRegister(email, password);
            router.push("/");
        } catch (error) {
            alert(error.message);
        }
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            registerOnClick();
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>

                <input
                    ref={emailPrompt}
                    type="email"
                    placeholder="Your email"
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