import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { AGENCY } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-100 mt-20">
      <div className="container-px py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500 text-white font-display font-bold">
              M
            </div>
            <div className="font-display font-bold text-lg text-white">
              {AGENCY.name}
            </div>
          </div>
          <p className="text-sm text-ink-200/80">
            Bhopal&apos;s trusted taxi service for outstation tours, local trips,
            airport drops and corporate travel. Sedan, Innova and Tempo
            Traveller available 24×7.
          </p>
          <div className="flex gap-3 mt-5">
            <a href={AGENCY.social.facebook} className="p-2 bg-white/5 rounded-lg hover:bg-brand-500 transition" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={AGENCY.social.instagram} className="p-2 bg-white/5 rounded-lg hover:bg-brand-500 transition" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={AGENCY.social.youtube} className="p-2 bg-white/5 rounded-lg hover:bg-brand-500 transition" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a
              href={`https://wa.me/${AGENCY.whatsapp.replace(/\D/g, "")}`}
              className="p-2 bg-white/5 rounded-lg hover:bg-brand-500 transition"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/fleet", "Our Fleet"],
              ["/routes", "Popular Routes"],
              ["/about", "About Us"],
              ["/contact", "Contact"],
              ["/booking", "Book a Cab"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href as string}
                  className="text-ink-200/80 hover:text-brand-300 transition"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">
            Our Services
          </h4>
          <ul className="space-y-2 text-sm text-ink-200/80">
            <li>Outstation Taxi</li>
            <li>Local Bhopal Rentals</li>
            <li>Airport Transfers</li>
            <li>Corporate Travel</li>
            <li>Wedding Cars</li>
            <li>Pilgrimage Tours</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-ink-200/90">
            <li className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 text-brand-400" />
              <span>{AGENCY.address}</span>
            </li>
            <li className="flex gap-3">
              <FaPhoneAlt className="mt-1 text-brand-400" />
              <a href={`tel:${AGENCY.phonePrimary.replace(/\s/g, "")}`}>
                {AGENCY.phonePrimary}
                <br />
                {AGENCY.phoneSecondary}
              </a>
            </li>
            <li className="flex gap-3">
              <FaEnvelope className="mt-1 text-brand-400" />
              <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px py-5 flex flex-col md:flex-row items-center justify-between text-xs text-ink-200/70">
          <div>
            © {new Date().getFullYear()} {AGENCY.name}. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            Designed for {AGENCY.city}, {AGENCY.state} · {AGENCY.hours}
          </div>
        </div>
      </div>
    </footer>
  );
}
