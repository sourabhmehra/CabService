"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";
import { AGENCY } from "@/lib/config";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Our Fleet" },
  { href: "/routes", label: "Popular Routes" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-100">
      <div className="container-px flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-brand-500 text-white font-display font-bold">
            M
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-ink-900">
              {AGENCY.shortName}
            </div>
            <div className="text-[11px] text-ink-500 font-medium">
              {AGENCY.tagline}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${AGENCY.phonePrimary.replace(/\s/g, "")}`}
            className="btn-ghost"
          >
            <FaPhoneAlt /> {AGENCY.phonePrimary}
          </a>
          <Link href="/booking" className="btn-primary">
            Book a Cab
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg ring-1 ring-ink-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white">
          <div className="container-px py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-2 text-ink-700 font-medium"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={`tel:${AGENCY.phonePrimary.replace(/\s/g, "")}`}
              className="py-2 text-brand-600 font-semibold"
            >
              Call {AGENCY.phonePrimary}
            </a>
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Book a Cab
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
