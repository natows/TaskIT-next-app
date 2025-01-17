import Link from "next/link"
import DayEditing from "./day"
export default function DayPage({params}){
    const {date} = params;
    return(
        <>
        <Link href ="/">Go back</Link>
        <Link href="/account">Your Profile</Link>
        <DayEditing />
        </>
    )
}