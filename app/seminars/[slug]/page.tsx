import {Suspense} from "react";
import SeminarDetails from "@/Components/SeminarDetails";

const SeminarDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = params.then((p) => p.slug);

    return (
        <main>
            <Suspense fallback={<div className="items-center justify-center font-[papyrus]">Loading...</div>}>
                <SeminarDetails params={slug} />
            </Suspense>
        </main>
    )
}
export default SeminarDetailsPage
