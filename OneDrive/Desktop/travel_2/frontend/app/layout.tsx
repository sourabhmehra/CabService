import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCallButton from "@/components/FloatingCallButton";

export const metadata: Metadata = {
  title: "Mehra Tour and Travel | Taxi Service in Bhopal",
  description:
    "Book reliable taxi service in Bhopal — outstation, local, airport drops & hill station trips. Sedan, Innova, Tempo Traveller at transparent per-km pricing.",
  keywords: [
    "taxi service bhopal",
    "mehra tour and travel",
    "bhopal cab booking",
    "outstation taxi bhopal",
    "innova rental bhopal",
    "tempo traveller bhopal",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-ink-900 font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCallButton />
      </body>
    </html>
  );
}
