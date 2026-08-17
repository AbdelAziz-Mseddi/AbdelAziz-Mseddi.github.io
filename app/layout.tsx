import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DayNightField } from "@/components/DayNightField";
import { Flyby } from "@/components/eggs/Flyby";
import { KenzIndicator } from "@/components/eggs/KenzIndicator";
import { Moon } from "@/components/eggs/Moon";
import { Terminal } from "@/components/eggs/Terminal";
import { MainSoundtrack } from "@/components/MainSoundtrack";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abdelaziz Mseddi, Software Engineering Student",
  description:
    "Portfolio of Abdelaziz Mseddi, software engineering student at INSAT and AI engineer at Rém Data & AI. Retrieval and agent systems, backend work, and photography.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <DayNightField />
        <Flyby />
        <KenzIndicator />
        <Moon />
        <Terminal />
        <MainSoundtrack />
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
