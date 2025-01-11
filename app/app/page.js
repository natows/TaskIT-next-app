"use client"
import Link from "next/link"
import {useState, useEffect} from "react"
import {currentUser, logout} from "./login/user.js"
import Calendar from "./calendar.js"
export default function HomePage() {
  const initialUser = currentUser();
  const [user, setUser] = useState(initialUser)

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
          <Link href="/account">Your account</Link>
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
