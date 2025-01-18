"use client"
import Link from "next/link"
import {useState, useEffect} from "react"
import {currentUser, logout} from "./login/user.js"
import Calendar from "./Calendar.js"
import CurrentTasks from "./CurrentTasks.js"
import BrowseTasks from "./BrowseTasks.js"
export default function HomePage() {
  const initialUser = currentUser();
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (user === null) {
      logout()
    }
  },[user])

  function userToNull(){
    setUser(null)
  }
  
  return (
    <>
      <p>Home</p>
      {
        user !== null ?
          <>
          <p>Welcome {initialUser.username}!</p>
          <button onClick={userToNull}>Log out</button>
          <Link href="/account">Your Profile</Link>
          <BrowseTasks />
          <p>Get your day started!</p>
          <CurrentTasks />
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
