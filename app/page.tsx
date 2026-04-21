import {Suspense} from "react";
import SeminarCard from "@/Components/SeminarCard";
import {ISeminar} from "@/database";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
    "use cache";
    cacheLife("hours");

    const res = await fetch(`${BASE_URL}/api/seminars`);
    const { seminars } = await res.json();

    return (
        <section>
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-[#f7930a] text-center text-4xl md:text-7xl font-extrabold font-[papyrus] mt-4 mb-2">
                    Stewardship Seminars
                </h1>
                <p className="text-center text-[#f7930a] text-lg md:text-2xl font-bold font-[papyrus]">
                    ...your ultimate guide to being a better steward...
                </p>
            </div>

            <div className="mt-12 mx-6 space-y-7">
                <h3 className="text-xl md:text-3xl text-[#f7930a] font-[serif] font-bold">Featured Seminars</h3>

                <ul className="flex flex-row gap-6 flex-wrap justify-evenly items-center">
                    {seminars && seminars.length > 0 && seminars.map((seminar: ISeminar) => (
                        <li key={seminar.title} >
                            <Suspense fallback={<div className="font-[papyrus] items-center justify-center">Loading...</div>}>
                                <SeminarCard {...seminar} />
                            </Suspense>
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    );
}

export default Home;
