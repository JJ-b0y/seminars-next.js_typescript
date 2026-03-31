import Link from "next/link";

const NavBar = () => {
    return (
        <header>
            <nav className="w-full shadow-md">
                <div className="flex justify-between items-center py-4 mx-6">
                    <Link href='/' className="border-4 border-violet-950 rounded-full">
                        <span className="text-3xl text-violet-950 font-extrabold font-[papyrus]">JR</span>
                    </Link>

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
