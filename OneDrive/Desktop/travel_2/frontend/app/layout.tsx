import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCallButton from "@/components/FloatingCallButton";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mehratoursandtravels.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Mehra Tour and Travel | Taxi Service in Bhopal",
    template: "%s | Mehra Tour and Travel",
  },
  description:
    "Book reliable taxi service in Bhopal — outstation, local, airport drops & hill station trips. Sedan, Innova, Tempo Traveller at transparent per-km pricing. Call +91 7223827334.",
  keywords: [
    "taxi service bhopal",
    "cab service bhopal",
    "mehra tour and travel",
    "bhopal cab booking",
    "outstation taxi bhopal",
    "innova rental bhopal",
    "tempo traveller bhopal",
    "bhopal to indore taxi",
    "bhopal to ujjain taxi",
    "bhopal airport cab",
    "taxi bhopal 24 hour",
    "cab booking bhopal mp",
  ],
  authors: [{ name: "Mehra Tour and Travel" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Mehra Tour and Travel",
    title: "Mehra Tour and Travel | Taxi Service in Bhopal",
    description:
      "Bhopal's trusted taxi service — Sedan, Innova & Tempo Traveller for outstation, local and airport trips. Transparent per-km pricing. 24×7 available.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehra Tour and Travel | Taxi Service in Bhopal",
    description:
      "Bhopal's trusted taxi service — Sedan, Innova & Tempo Traveller. 24×7 available.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

// LocalBusiness structured data — helps Google show you in local searches
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BASE_URL,
  name: "Mehra Tour and Travel",
  description:
    "Bhopal-based taxi & tour service offering outstation, local and airport cab bookings. Sedan, Innova and Tempo Traveller available 24×7.",
  url: BASE_URL,
  telephone: "+917223827334",
  email: "bookings@mehratoursandtravels.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "MP Nagar Zone-I",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    postalCode: "462011",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 23.2332,
    longitude: 77.4333,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  areaServed: {
    "@type": "State",
    name: "Madhya Pradesh",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Taxi Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sedan Taxi (₹9/km)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Innova Taxi (₹11/km)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tempo Traveller (₹15/km)" } },
    ],
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
