'use client';

import React, {useState} from "react";
import {registerSeminar} from "@/lib/actions/register.actions";

const RegisterSeminar = ({ seminarId, slug }: { seminarId: string, slug: string }) => {
    const [email, setEmail] = useState('');
    const [registered, setRegistered] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { success } = await registerSeminar({ seminarId, slug, email });

        if (success) {
            setRegistered(true);
        } else {
            console.error('Registration Failed');
            setRegistered(false);
        }
    }

    return (
        <div className="w-full flex flex-col">
            {registered ? (
                <p className="font-mono text-[#f7930a] text-md">Congratulations! You are registered!</p>
            ):(
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col mb-6">
                        <label htmlFor="email" className="text-[#f7930a] mb-2">Email Address:</label>
                        <input
                            required={true}
                            type="email"
                            id="email"
                            name="email"
                            value={email.trim()}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="bg-[#f7930a] text-[#140c01]"
                        />
                    </div>
                    <button type="submit" className="bg-[#f7930a] hover:bg-[#f7730f] text-[#140c01] font-[serif] font-bold rounded-2xl w-full" >
                        Register
                    </button>
                </form>
            )}
        </div>
    )
}
export default RegisterSeminar
