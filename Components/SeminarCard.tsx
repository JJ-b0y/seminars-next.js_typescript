import Link from "next/link";
import Image from "next/image";

interface Props {
    title: string;
    image: string;
    slug: string;
    venue: string;
    date: string;
    time: string;
}

const SeminarCard = ({ title, image, slug, venue, date, time }: Props) => {
    return (
        <Link href={`/seminars/${slug}`} id={"seminar-card"}>
            <div className="border-t-4 border-l-4 border-r-2 border-b-2 border-[#f7930a] rounded-2xl w-[450px] !h-[500px] max-sm:w-full hover:shadow-lg hover:shadow-[#f7930a] py-6">
                <div className="mx-6">
                    <Image src={image} alt={title} width={400} height={300} className="rounded-xl" />

                    <span className="text-[#f7930a] text-sm mb-4">📍 {venue}</span>

                    <p className="text-[#f7930a] font-bold text-xl gap-6">✔ {title}</p>

                    <div className="flex gap-6 mt-4">
                        <span className="text-[#f7930a] text-xs">📅 {date}</span>
                        <span className="text-[#f7930a] text-xs">⏰ {time}AM</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
export default SeminarCard
