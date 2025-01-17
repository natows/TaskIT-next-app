import Link from "next/link"
import DoneTasks from "./DoneTasks"
export default function AccountPage(){
    return(
        <>
        <Link href="account/settings">Settings</Link>
        <DoneTasks />
        </>
    )
}

