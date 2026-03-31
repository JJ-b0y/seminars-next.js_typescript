'use client';

const ExploreBtn = () => {
    return (
        <button
            type="button"
            style={{ width: '320px', fontSize: '20px', paddingTop: '10px', paddingBottom: '10px' }}
            className="flex justify-center items-center rounded bg-pink-950 hover:bg-pink-700 text-white font-[courier] font-semibold mt-7 mx-auto"
        >
            <a href="products" className="text-xl">
                Explore
            </a>
        </button>
    )
}
export default ExploreBtn;
