import Link from "next/link"
export default function loginLayout( {children}){
    return (
        <div>
            <Link href={"/"}>Go back</Link>
            {children}
        </div>
    );
}