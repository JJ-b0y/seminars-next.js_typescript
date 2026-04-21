'use client';

import React, {useState} from "react";
import { useRouter} from "next/navigation";

const CreateSeminar = () => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [overview, setOverview] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [venue, setVenue] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [mode, setMode] = useState("");
    const [audience, setAudience] = useState("");
    const [agenda, setAgenda] = useState<string[]>([]);
    const [agendaInput, setAgendaInput] = useState("");
    const [guestSpeaker, setGuestSpeaker] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const handleAddAgenda = () => {
        const trimmed = agendaInput.trim();
        if(trimmed && !agenda.includes(trimmed)){
            setAgenda([...agenda, trimmed]);
            setAgendaInput("");
        }
    }

    const handleRemoveAgenda = (index: number) => {
        setAgenda(agenda.filter((_, i) => i !== index));
    }

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if(trimmed && !tags.includes(trimmed)){
            setTags([...tags, trimmed]);
            setAgendaInput("");
        }
    }

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('overview', overview);
        formData.append('venue', venue);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('mode', mode);
        formData.append('audience', audience);
        formData.append('guestSpeaker', guestSpeaker);

        if (!image || !(image instanceof File)) {
            console.error("Invalid image file");
            return;
        }

        if (image) {
            formData.append('image', image);
        }

        formData.append('tags', JSON.stringify(tags));
        formData.append('agenda', JSON.stringify(agenda));

        console.log(formData);


        try {
            const res = await fetch('/api/seminars', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setTitle("");
                setDescription("");
                setOverview("");
                setImage(null);
                setVenue("");
                setDate("");
                setTime("");
                setMode("");
                setAudience("");
                setGuestSpeaker("");
                setTagInput("");
                setTags([]);
                setAgendaInput("");
                setAgenda([]);

                router.replace('/');
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <main>
            <h1 className="text-[#f7930a] text-center text-3xl md:text-6xl font-extrabold font-[serif] m-12">
                CREATE SEMINAR
            </h1>

            <div className="border-t-4 border-l-4 border-r-2 border-b-2 border-[#f7930a] rounded-2xl p-12 m-6">
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col mb-6">
                        <label htmlFor="title" className="text-[#f7930a] mb-4 font-bold">Title:</label>
                        <input
                            required={true}
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter the Seminar Title"
                            className="bg-[#f7930a] text-[#140c01] mb-6"
                        />
                        <label htmlFor="description" className="text-[#f7930a] mb-4 font-bold">Description:</label>
                        <input
                            required={true}
                            type="text"
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the Seminar Description"
                            className="bg-[#f7930a] text-[#140c01] mb-6"
                        />
                        <label htmlFor="overview" className="text-[#f7930a] mb-4 font-bold">Overview:</label>
                        <input
                            required={true}
                            type="text"
                            id="overview"
                            name="overview"
                            value={overview}
                            onChange={(e) => setOverview(e.target.value)}
                            placeholder="Enter the Seminar Overview"
                            className="bg-[#f7930a] text-[#140c01]"
                        />
                    </div>

                    <div className="flex flex-row flex-wrap gap-6 w-full justify-between mb-6">
                        <div className="flex flex-col">
                            <label htmlFor="image" className="text-[#f7930a] mb-2 font-bold pr-4">Image:</label>
                            <input
                                required={true}
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setImage(file);
                                }}
                                placeholder="Upload the Seminar Image"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="venue" className="text-[#f7930a] mb-2 font-bold pr-4">Venue:</label>
                            <input
                                required={true}
                                type="text"
                                id="venue"
                                name="venue"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="Enter the Seminar Venue"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="date" className="text-[#f7930a] mb-2 font-bold pr-4">Date:</label>
                            <input
                                required={true}
                                type="text"
                                id="date"
                                name="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="Enter the Seminar Date"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="time" className="text-[#f7930a] mb-2 font-bold pr-4">Time:</label>
                            <input
                                required={true}
                                type="text"
                                id="time"
                                name="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Enter the Seminar Time"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="mode" className="text-[#f7930a] mb-2 font-bold pr-4">Mode:</label>
                            <select
                                required={true}
                                id="mode"
                                name="mode"
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="bg-[#f7930a] text-[#140c01]"
                            >
                                <option value="">--Select a Mode--</option>
                                <option value="hybrid">HYBRID</option>
                                <option value="physical">PHYSICAL</option>
                                <option value="virtual">VIRTUAL</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="audience" className="text-[#f7930a] mb-4 font-bold">Audience:</label>
                        <input
                            required={true}
                            type="text"
                            id="audience"
                            name="audience"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="Enter the kind of Audience"
                            className="bg-[#f7930a] text-[#140c01] mb-6"
                        />
                        <label htmlFor="agenda" className="text-[#f7930a] mb-4 font-bold">Agenda:</label>
                        <div className="mb-6">
                            <input
                                type="text"
                                id="agenda"
                                name="agenda"
                                value={agendaInput}
                                onChange={(e) => setAgendaInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddAgenda();
                                    }
                                }}
                                placeholder="Enter the Agenda"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                            <button type="button" onClick={handleAddAgenda}>➕</button>
                            <ul>
                                {agenda.map((item, i) => (
                                    <li key={i} className="text-[#f7930a] text-sm my-2 gap-2">
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAgenda(i)}
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <label htmlFor="guestSpeaker" className="text-[#f7930a] mb-4 font-bold">Guest Speaker:</label>
                        <input
                            required={true}
                            type="text"
                            id="guestSpeaker"
                            name="guestSpeaker"
                            value={guestSpeaker}
                            onChange={(e) => setGuestSpeaker(e.target.value)}
                            placeholder="Enter the Guest Speaker's name"
                            className="bg-[#f7930a] text-[#140c01] mb-6"
                        />
                        <label htmlFor="tags" className="text-[#f7930a] mb-4 font-bold">Tags:</label>
                        <div className="mb-10">
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                placeholder="Enter Tags for this Seminar"
                                className="bg-[#f7930a] text-[#140c01]"
                            />
                            <button type="button" onClick={handleAddTag}>➕</button>
                            <ul>
                                {tags.map((item, i) => (
                                    <li key={i} className="text-[#f7930a] text-sm my-2 gap-2">
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(i)}
                                        >
                                            ✖
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-[#f7930a] hover:bg-[#f7730f] text-[#140c01] text-lg font-[serif] font-bold rounded-2xl px-6 py-2" >
                            Create Seminar
                        </button>
                    </div>

                </form>
            </div>
        </main>
    )
}
export default CreateSeminar
