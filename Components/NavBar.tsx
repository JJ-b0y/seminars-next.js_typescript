import Link from "next/link";

const NavBar = () => {
    return (
        <header>
            <nav className="w-full shadow-md">
                <div className="flex justify-between items-center py-4 mx-6">
                    <div className="rounded-full">
                        <Link href='/' className="" >
                            <span className="text-xl text-violet-950 font-extrabold font-mono px-6">SS</span>
                        </Link>
                    </div>

                    <ul className="flex gap-6 cursor-pointer">
                        <li className="hover:text-pink-700 hover:text-xl">🙍‍♂️ Account</li>
                        <li className="hover:text-pink-700 hover:text-xl">✉ Contact</li>
                        <li className="hover:text-pink-700 hover:text-xl">🛒 Cart</li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
export default NavBar;
