"use client"
import {useState, useEffect, useRef} from "react"
import {logIn} from "./user.js"
import {useRouter} from "next/navigation"
export default function loginPage(){
    const router = useRouter();
    const loginPrompt = useRef();
    const passwordPrompt = useRef();
    const emailPrompt = useRef();

    function loginOnClick(){
        const login = loginPrompt.current.value.trim();
        const password = passwordPrompt.current.value.trim();
        const email = emailPrompt.current.value.trim();
        if (!login || !password || !email) {
            alert("Incomplete input");
            return;
        }
        const data = logIn(login,password, email);
        localStorage.setItem("user", JSON.stringify(data));

        router.push("/");
    };

    function handleKeyDown(){
        if (event.key === "Enter"){
            loginOnClick();
        };
    };
    

    return (
        <div>
            <p>Log into your account</p>
            <input ref={loginPrompt} type="text" placeholder="Your username" onKeyDown={handleKeyDown}></input>
            <input ref={passwordPrompt} type="password" placeholder="Your password" onKeyDown={handleKeyDown}></input>
            <input ref={emailPrompt} type="text" placeholder="Your email" onKeyDown={handleKeyDown}></input>
            <button onClick={loginOnClick}>Zaloguj</button>
        </div>
    );
}