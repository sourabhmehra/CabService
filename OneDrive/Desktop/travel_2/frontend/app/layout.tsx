import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCallButton from "@/components/FloatingCallButton";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mehratourandtravels.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Mehra Tour and Travel | Taxi Service in Bhopal | Book Cab Online",
    template: "%s | Mehra Tour and Travel Bhopal",
  },
  description:
    "Mehra Tour and Travel — Bhopal's most trusted taxi service. Book Dzire, Ertiga, Innova, Crysta & Tempo Traveller for outstation, local, airport & pilgrimage trips. Transparent per-km pricing, 24×7 available. Call +91 7223827334.",
  keywords: [
    "taxi service in bhopal",
    "cab service bhopal",
    "mehra tour and travel",
    "mehra tour and travel bhopal",
    "bhopal cab booking",
    "bhopal taxi booking",
    "outstation taxi bhopal",
    "bhopal to ujjain taxi",
    "bhopal to pachmarhi taxi",
    "bhopal to indore taxi",
    "bhopal to khajuraho taxi",
    "bhopal to omkareshwar taxi",
    "bhopal to sanchi taxi",
    "innova rental bhopal",
    "innova crysta bhopal",
    "tempo traveller bhopal",
    "airport cab bhopal",
    "raja bhoj airport taxi",
    "cab booking bhopal mp",
    "taxi bhopal 24 hour",
    "ertiga cab bhopal",
    "dzire cab bhopal",
    "outstation cab madhya pradesh",
    "pilgrimage taxi bhopal",
    "corporate cab bhopal",
    "one way taxi bhopal",
    "round trip cab bhopal",
  ],
  authors: [{ name: "Mehra Tour and Travel", url: BASE_URL }],
  creator: "Mehra Tour and Travel",
  publisher: "Mehra Tour and Travel",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Mehra Tour and Travel",
    title: "Mehra Tour and Travel | Best Taxi Service in Bhopal",
    description:
      "Bhopal's trusted taxi service — Dzire, Ertiga, Innova, Crysta & Tempo Traveller for outstation, local and airport trips. Transparent per-km pricing. 24×7 available. Book now!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehra Tour and Travel | Taxi Service Bhopal",
    description:
      "Book cabs in Bhopal — Sedan, Innova & Tempo Traveller. Outstation, local & airport trips. 24×7 available. Call +91 7223827334.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "", // paste your Google Search Console verification code here
  },
};

// ── Schema 1: LocalBusiness ───────────────────────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "TravelAgency"],
  "@id": `${BASE_URL}/#business`,
  name: "Mehra Tour and Travel",
  alternateName: "Mehra Travels Bhopal",
  description:
    "Bhopal-based taxi & tour service offering outstation, local and airport cab bookings. Dzire, Ertiga, Innova, Crysta and Tempo Traveller available 24×7 across Madhya Pradesh.",
  url: BASE_URL,
  telephone: "+917223827334",
  email: "bookings@mehratourandtravels.in",
  foundingDate: "2013",
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
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  areaServed: [
    { "@type": "City", name: "Bhopal" },
    { "@type": "State", name: "Madhya Pradesh" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Taxi & Cab Services in Bhopal",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Swift Dzire / Aura Cab – ₹12/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maruti Ertiga Cab – ₹14/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Toyota Innova Cab – ₹16/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Innova Crysta Cab – ₹18/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tempo Traveller 17 Seater – ₹25/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Tempo Traveller 26 Seater – ₹34/km" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Force Urbania 17 Seater – ₹35/km" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "500",
    bestRating: "5",
    worstRating: "1",
  },
  sameAs: [],
};

// ── Schema 2: FAQ (boosts Google rich snippet) ────────────────────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the taxi fare from Bhopal to Ujjain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The taxi fare from Bhopal to Ujjain (190 km) starts from ₹2,780 for a Swift Dzire, ₹3,740 for an Innova and ₹5,750 for a 17-seater Tempo Traveller with Mehra Tour and Travel.",
      },
    },
    {
      "@type": "Question",
      name: "How to book a cab in Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can book a cab in Bhopal by visiting mehratourandtravels.in, entering your pickup and drop location, selecting your vehicle and confirming your booking. You can also call us at +91 7223827334 for instant booking.",
      },
    },
    {
      "@type": "Question",
      name: "What taxi services are available in Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mehra Tour and Travel offers one-way taxi, round-trip cab, local Bhopal taxi by hour, airport transfer (Raja Bhoj Airport), and outstation trips across Madhya Pradesh — all available 24×7.",
      },
    },
    {
      "@type": "Question",
      name: "What is the fare from Bhopal to Pachmarhi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bhopal to Pachmarhi (210 km) taxi fare starts at ₹3,020 for a Dzire, ₹4,060 for Innova and ₹6,250 for a Tempo Traveller with Mehra Tour and Travel Bhopal.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any hidden charges in the taxi fare?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No hidden charges. Mehra Tour and Travel charges a transparent per-km rate plus base fare and driver allowance. Toll tax and parking charges are extra and paid at actuals.",
      },
    },
    {
      "@type": "Question",
      name: "Does Mehra Tour and Travel provide airport taxi in Bhopal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide 24×7 airport taxi service from Raja Bhoj Airport Bhopal. Book online or call +91 7223827334 for immediate pickup.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
