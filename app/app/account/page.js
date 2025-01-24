"use client"
import Link from "next/link"
import DoneTasks from "./DoneTasks"
import TaskExportImport from "./dataFormatting/TaskExportImport"
import {currentUser, logout} from "../login/user.js"
import {useState, useEffect} from "react"
import { useRouter } from "next/navigation"


export default function AccountPage(){
    const initialUser = currentUser();
    const [user, setUser] = useState(initialUser);
    const router = useRouter();
    useEffect(() => {
    if (user === null) {
        router.push("/")
    }
    },[user])

    function userToNull(){
    setUser(null)
    }
    return(
        <div>
        <button onClick={userToNull}>Log out</button>
        <Link href="account/settings">Settings</Link>
        <DoneTasks />
        <TaskExportImport />
        </div>
    )
}

