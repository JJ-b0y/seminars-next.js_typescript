import {notFound} from "next/navigation";
import Image from "next/image";
import RegisterSeminar from "@/Components/RegisterSeminar";
import {ISeminar} from "@/database";
import {getLikeActionsBySlug} from "@/lib/actions/seminar.actions";
import SeminarCard from "@/Components/SeminarCard";
import {cacheLife} from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const SeminarDetailItems = ({ icon, label }: { icon: string, label: string }) => (
    <div className="flex flex-row gap-4 text-lg md:text-xl text-[#f7930a] font-[serif]">
        <div className="w-8">{icon}</div>
        <p>{label}</p>
    </div>
)

const SeminarAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className="mb-12">
        <h3 className="text-[#f7930a] uppercase text-xl md:text-4xl font-extrabold font-[serif] mt-4 mb-2">
            Agenda
        </h3>
        <ul className="text-[#f7930a] text-lg md:text-2xl font-bold font-[serif]">
            {agendaItems.map((item) => (
                <li key={item}>
                    🔸{item}
                </li>
            ))}
        </ul>
    </div>
)

const SeminarTags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) => (
            <div key={tag} className="bg-[#f7930a] text-[#140c01] font-bold p-6 border-2 border-none rounded-xl">
                {tag}
            </div>
        ))}
    </div>
)

const SeminarDetails = async ({ params }: { params: Promise<string> }) => {
    'use cache';
    cacheLife('hours');

    const slug = await params;
    let seminar;

    try {
        const req = await fetch(`${BASE_URL}/api/seminars/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!req.ok) {
            if (req.status === 404) {
                return notFound();
            }
            throw new Error(`Failed to fetch seminar: ${req.statusText}`);
        }

        const res = await req.json();

        seminar = res.seminar;

        if (!seminar) {
            return notFound();
        }
    } catch (err) {
        console.error('Error fetching seminar', err);
        return notFound();
    }

    const likeSeminars: ISeminar[] = await getLikeActionsBySlug(slug);

    return (
        <section className="m-8">
            <div className="flex flex-col justify-center items-center w-full mb-12">
                <h1 className="text-[#f7930a] text-center text-3xl md:text-6xl font-extrabold font-[serif] mt-4 mb-2">
                    {seminar.title}
                </h1>
                <p className="text-center text-[#f7930a] text-lg md:text-2xl font-bold font-[serif]">
                    {seminar.description}.
                </p>
            </div>

            <div className="flex flex-row gap-6 flex-wrap mb-12">
                <Image src={seminar.image} alt={seminar.title} width={800} height={800} />
                <div className="border-t-4 border-l-4 border-r-2 border-b-2 border-[#f7930a] rounded-2xl w-[600px] h-auto p-6">
                    <h2 className="text-[#f7930a] text-center font-bold font-[serif] text-lg md:text-xl mb-6">Register Now!</h2>

                    <RegisterSeminar seminarId={seminar._id} slug={seminar.slug}  />
                </div>
            </div>

            <section className="flex-col-gap-2 mb-12">
                <h3 className="text-[#f7930a] uppercase text-xl md:text-4xl font-extrabold font-[serif] mt-4 mb-2">
                    Overview
                </h3>
                <p className="text-[#f7930a] text-lg md:text-2xl font-bold font-[serif] lg:w-[800px]">
                    {seminar.overview}.
                </p>
            </section>

            <section className="flex-col-gap-2 mb-12">
                <h3 className="text-[#f7930a] uppercase text-xl md:text-4xl font-extrabold font-[serif] mt-4 mb-2">
                    Seminar Details
                </h3>
                <SeminarDetailItems icon="📅" label={seminar.date} />
                <SeminarDetailItems icon="🕘" label={seminar.time} />
                <SeminarDetailItems icon="📍" label={seminar.venue} />
                <SeminarDetailItems icon="🖥" label={seminar.mode.toUpperCase()} />
                <SeminarDetailItems icon="👨‍👦‍👦" label={seminar.audience} />
            </section>

            <SeminarAgenda agendaItems={seminar.agenda.length > 1 ? seminar.agenda : JSON.parse(seminar.agenda[0]) } />

            <section className="flex-col-gap-2 mb-12">
                <h3 className="text-[#f7930a] uppercase text-xl md:text-4xl font-extrabold font-[serif] mt-4 mb-2">
                    Guest Speaker:
                </h3>
                <p className="text-[#f7930a] text-lg md:text-2xl font-bold font-[serif]">
                    {seminar.guestSpeaker}
                </p>
            </section>

            <div className="my-6 mb-12">
                <SeminarTags tags={seminar.tags.length > 1 ? seminar.tags : JSON.parse(seminar.tags[0])} />
            </div>

            <div className="flex flex-col w-full gap-4 pt-10 mb-16">
                <h2 className="text-[#f7930a] uppercase text-lg md:text-2xl font-extrabold font-[serif] mt-4 mb-2">
                    More Seminars
                </h2>
                <div className="flex flex-row gap-6 flex-wrap justify-items-start items-center">
                    {likeSeminars.length > 0 && likeSeminars.map((likeSeminar: ISeminar) => (
                        <SeminarCard key={likeSeminar.title} {...likeSeminar} />
                    ))}
                </div>
            </div>

        </section>
    )
}
export default SeminarDetails
