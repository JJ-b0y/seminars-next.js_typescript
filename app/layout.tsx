import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import React from "react";
import { cn } from "@/lib/utils";
import MagicRings from '../Components/MagicRings';
import NavBar from "@/Components/NavBar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stewardship Seminars",
  description: "Stewardship Seminars for 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
          className={cn("min-h-screen", "antialiased", schibstedGrotesk.variable, martianMono.variable, "font-sans", geist.variable)}
      >
      <NavBar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <MagicRings
            color="#f7930a"
            colorTwo="#edaa0c"
            ringCount={6}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={0.1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={false}
            mouseInfluence={0.2}
            hoverScale={3.2}
            parallax={0.05}
            clickBurst={false}
          />
        </div>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
