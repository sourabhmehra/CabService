"use client";

import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { AGENCY } from "@/lib/config";

export default function FloatingCallButton() {
  const phone = AGENCY.phonePrimary.replace(/\s/g, "");
  const wa = AGENCY.whatsapp.replace(/\D/g, "");
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
      <a
        href={`https://wa.me/${wa}?text=Hi%2C%20I%20want%20to%20book%20a%20taxi`}
        target="_blank"
        rel="noreferrer"
        className="grid place-items-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:scale-105 transition"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>
      <a
        href={`tel:${phone}`}
        className="grid place-items-center w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg hover:scale-105 transition"
        aria-label="Call"
      >
        <FaPhoneAlt className="text-xl" />
      </a>
    </div>
  );
}
