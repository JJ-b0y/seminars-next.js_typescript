import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Seminar from "@/database/seminar.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        const seminar = Object.fromEntries(formData.entries()) as Record<string, any>;

        const tags = JSON.parse(formData.get('tags') as string);
        const agenda = JSON.parse(formData.get('agenda') as string);

        delete seminar.tags;
        delete seminar.agenda;

        const file = formData.get("image") as File;

        if(!file) return NextResponse.json({ message: "Image file is required" }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "StewardshipSeminars"},
                (error, results) => {
                    if (error) return reject(error);

                    resolve(results);
                }
            ).end(buffer);
        });

        seminar.image = (uploadResult as { secure_url: string }).secure_url;

        const createdSeminar = await Seminar.create({
            ...seminar,
            agenda,
            tags,
        });

        return NextResponse.json(
            {
                message: "Seminar created successfully",
                seminar: createdSeminar,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                message: "Seminar Creation Failed",
                error: err instanceof Error ? err.message : "Unknown Error"
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const createdSeminars = await Seminar.find().sort({ createdAt: 1 });
        return NextResponse.json(
            {
                message: "Seminars fetched successfully",
                seminars: createdSeminars
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                message: "Seminar fetching failed",
                error: err
            },
            { status: 500 }
        );
    }
}