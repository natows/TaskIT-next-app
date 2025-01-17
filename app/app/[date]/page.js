import Link from "next/link"
import DayEditing from "./day"
export default function DayPage({params}){
    const {date} = params;
    return(
        <>
        <Link href ="/">Go back</Link>
        <p>Add your tasks for day: {date} </p>
        <DayEditing />
        </>
    )
}