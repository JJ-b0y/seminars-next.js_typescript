import Link from "next/link";

const Page = () => {
    return (
        <div className="">
            <h1>
                User Details
            </h1>

            <ul className="flex flex-row items-start justify-evenly w-full text-blue-600">
                <li><Link href="/users/1">User 1</Link></li>
                <li><Link href="/users/2">User 2</Link></li>
                <li><Link href="/users/3">User 3</Link></li>
                <li><Link href="/users/4">User 4</Link></li>
            </ul>
        </div>
    )
}
export default Page
