'use server';

import Register from "@/database/register.model";
import connectDB from "@/lib/mongodb";

export const registerSeminar = async ({ seminarId, slug, email }: { seminarId: string; slug: string; email: string; }) => {
    try {
        await connectDB();

        await Register.create({ seminarId, slug, email });

        return { success: true };
    } catch (err) {
        console.error('Registration Failed', err);
        return { success: false };
    }
}