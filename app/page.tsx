import React from 'react'
import ExploreBtn from "@/Components/ExploreBtn";

const Home = () => {

    return (
        <section>
            <div className="flex flex-col justify-center items-center w-full">
                <h1 className="text-center text-7xl font-extrabold font-[papyrus] mt-4 mb-2">
                    Junis Resources
                </h1>
                <p className="text-center text-violet-950 text-2xl font-bold font-[calibri]">
                    Your Ultimate Laundry, Cleaning & Body Care Supplies
                </p>
            </div>

            <ExploreBtn />

            <div className="mt-6 mx-6 space-y-4">
                <h3 className="text-3xl text-black font-[serif] font-bold">Top Products</h3>

                <ul>
                    {[{"category": "laundry", "product": "bleach"},
                        {"category": "body", "product": "shampoo"},
                        {"category": "dish", "product": "liquid soap"}].map(item => (
                            <li key={item.category} className="capitalize text-xl pt-4">{item.product}</li>
                    ))}
                </ul>

            </div>
        </section>
    );
}

export default Home;
