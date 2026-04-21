// Define route params type for type safety
import {NextRequest, NextResponse} from "next/server";
import connectDB from "@/lib/mongodb";
import {ISeminar, Seminar} from "@/database";

type RouteParams = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            return NextResponse.json(
                { message: "Invalid or missing slug parameter" },
                { status: 400 }
            );
        }

        const normalizedSlug = slug.trim().toLowerCase();

        const seminar: ISeminar | null = await Seminar.findOne({ slug: normalizedSlug }).lean();

        if(!seminar) {
            return NextResponse.json(
                { message: `Seminar with slug "${normalizedSlug}" not found` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Seminar fetched successfully", seminar },
            { status: 200 }
        );
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error("Error fetching event by slug", err);
        }

        if (err instanceof Error) {
            if (err.message.includes("MONGO_URL")) {
                return NextResponse.json(
                    { message: "Database configuration error" },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                {
                    message: "Failed to fetch seminar",
                    error: err.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "An unexpected error occurred" },
            { status: 500 }
        )
    }
}