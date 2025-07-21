import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Layout/Navbar";
import { BottomNav } from "@/components/Layout/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZouPlay - Jeux et Récompenses",
  description: "Jouez, gagnez des points et débloquez des récompenses avec ZouPlay",
  keywords: ["jeux", "récompenses", "points", "mini-jeux", "gamification"],
  authors: [{ name: "ZouPlay Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
