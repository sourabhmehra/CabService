import Link from "next/link";
import {
  FaShieldAlt,
  FaRupeeSign,
  FaUserTie,
  FaMapMarkedAlt,
  FaAward,
  FaHeart,
} from "react-icons/fa";
import { AGENCY } from "@/lib/config";

export const metadata = {
  title: `About Us | ${AGENCY.name}`,
  description:
    "Mehra Tour and Travel — Bhopal-based taxi service trusted by thousands of travellers across Madhya Pradesh.",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero-bg text-white py-14">
        <div className="container-px max-w-3xl">
          <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
            About Us
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3">
            Bhopal&apos;s neighbourhood travel partner
          </h1>
          <p className="mt-4 text-ink-100/85 text-lg">
            {AGENCY.name} is a Bhopal-based taxi & tour agency built around a
            simple promise — clean cars, fair prices, and drivers you can
            trust.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Our Story</h2>
            <p className="mt-4 text-ink-700">
              We started {AGENCY.shortName} with a single sedan and a vision:
              taxi service from Bhopal that doesn&apos;t play games with
              pricing. Today we run a fleet of well-maintained sedans, SUVs and
              Tempo Travellers covering every major destination in Madhya
              Pradesh and neighbouring states.
            </p>
            <p className="mt-4 text-ink-700">
              From quick airport drops in Bhopal to multi-day pilgrimages to
              Ujjain and Omkareshwar, hill-station trips to Pachmarhi or
              corporate group travel — our team handles every booking with the
              same care.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { n: "10+", l: "Years in service" },
                { n: "5000+", l: "Happy customers" },
                { n: "50+", l: "Cars in fleet" },
              ].map((s) => (
                <div key={s.l} className="card text-center">
                  <div className="font-display text-2xl font-extrabold text-brand-600">
                    {s.n}
                  </div>
                  <div className="text-xs text-ink-500 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <FaShieldAlt />,
                t: "Safety First",
                d: "Sanitised cars, verified drivers, GPS tracking, 24×7 customer support.",
              },
              {
                icon: <FaRupeeSign />,
                t: "Transparent Pricing",
                d: "Clear per-km rates. No surge, no hidden surprises.",
              },
              {
                icon: <FaUserTie />,
                t: "Trained Drivers",
                d: "Licensed, courteous and route-experienced drivers.",
              },
              {
                icon: <FaMapMarkedAlt />,
                t: "MP Specialists",
                d: "Deep local knowledge of every road, temple and tourist spot.",
              },
              {
                icon: <FaAward />,
                t: "Quality Promise",
                d: "If you're not happy with the ride, we'll make it right.",
              },
              {
                icon: <FaHeart />,
                t: "Customer Care",
                d: "Real humans on the phone, ready when you need us.",
              },
            ].map((b) => (
              <div key={b.t} className="card">
                <div className="w-12 h-12 grid place-items-center rounded-xl bg-brand-50 text-brand-600 text-xl">
                  {b.icon}
                </div>
                <h3 className="font-display font-semibold mt-3">{b.t}</h3>
                <p className="text-sm text-ink-500 mt-1">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-50">
        <div className="container-px text-center max-w-2xl mx-auto">
          <span className="pill">Get In Touch</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
            Have a question? Want a custom quote?
          </h2>
          <p className="text-ink-500 mt-3">
            Our team is just one tap away — 24×7.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
            <Link href="/booking" className="btn-primary">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
