"use client"
import Link from "next/link"
import {useState, useEffect} from "react"
import {currentUser, logout} from "./login/user.js"
import Calendar from "./Calendar.js"
import CurrentTasks from "./CurrentTasks.js"
import BrowseTasks from "./BrowseTasks.js"
import AddTask from "./AddTasks.js"


export default function HomePage() {
    const initialUser = currentUser();
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        if (user === null) {
            logout(); 
        }
    }, [user]);

    function userToNull() {
        setUser(null);  
        logout();  
    }
  
    return (
        <>
            <p>Home</p>
            {
                user !== null ?
                    <>
                        <p>Welcome {initialUser.username}!</p>
                        <button onClick={userToNull}>Log out</button>
                        <Link href="/account"><i className="fas fa-user"></i></Link>
                        <BrowseTasks />
                        <p>Get your day started!</p>
                        <CurrentTasks />
                        <AddTask />
                        <Calendar />
                    </>
                    :
                    <>
                        <Link href="/login">Log in</Link>
                    </>
            }
        </>
    );
}
