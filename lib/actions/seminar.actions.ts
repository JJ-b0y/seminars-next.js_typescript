'use server';

import connectDB from "@/lib/mongodb";
import Seminar from "@/database/seminar.model";

export async function getLikeActionsBySlug(slug: string) {
    try {
        await connectDB();

        const seminar = await Seminar.findOne({ slug });
        return await Seminar.find({ _id: { $ne: seminar._id} }).lean();
    } catch (err) {
        return [];
    }
}