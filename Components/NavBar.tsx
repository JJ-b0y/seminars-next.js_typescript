import Link from "next/link";

const NavBar = () => {
    return (
        <header>
            <nav className="w-full shadow-sm shadow-[#f7930a]">
                <div className="flex justify-between items-center py-4 mx-6">
                    <div className="rounded-full">
                        <Link href={'/'} >
                            <span className="text-xl text-[#f7930a] font-extrabold font-[papyrus] px-1 md:px-6">SS</span>
                        </Link>
                    </div>

                    <ul className="flex gap-6 cursor-pointer font-bold font-[serif]">
                        <Link href={'/'}>
                            <li className="hover:text-xl text-[#f7930a]">Home</li>
                        </Link>
                        <Link href={'/create-seminar'}>
                            <li className="hover:text-xl text-[#f7930a]">Create Seminars</li>
                        </Link>
                    </ul>
                </div>
            </nav>
        </header>
    )
}
export default NavBar;
