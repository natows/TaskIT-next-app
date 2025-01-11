import {useState} from "react"
export default function Calendar(){
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState([])
    return(
        <div>
            <p>{currentDate.getFullYear()}</p>
        </div>
    )
}