import Link from "next/link";
import { FaUserTie, FaSuitcase, FaCheckCircle } from "react-icons/fa";
import { INR, type Vehicle } from "@/lib/api";
import { API_BASE } from "@/lib/config";

async function getVehicles(): Promise<Vehicle[]> {
  try {
    const base = API_BASE || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/vehicles`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Our Fleet | Mehra Tour and Travel",
  description:
    "Explore Sedan, Innova and Tempo Traveller cars available for booking in Bhopal.",
};

export default async function FleetPage() {
  const vehicles = await getVehicles();
  return (
    <>
      <section className="hero-bg text-white py-14">
        <div className="container-px">
          <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
            Our Fleet
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3">
            Cars built for every kind of journey
          </h1>
          <p className="mt-3 text-ink-100/85 max-w-2xl">
            From comfortable sedans for solo travellers to spacious Tempo
            Travellers for large groups — we have the right vehicle for your
            trip.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-8">
          {vehicles.length === 0 && (
            <div className="card text-center text-ink-500">
              Start the API server to load fleet details.
            </div>
          )}
          {vehicles.map((v) => {
            const features = (v.features || "").split(",").map((s) => s.trim()).filter(Boolean);
            return (
              <div
                key={v.slug}
                className="card md:p-8 grid md:grid-cols-[280px_1fr_240px] gap-6 items-center"
              >
                <div className="rounded-xl overflow-hidden border border-ink-100 bg-brand-50">
                  {v.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.image_url} alt={v.name} className="w-full" />
                  )}
                </div>

                <div>
                  <h2 className="font-display font-bold text-2xl">
                    {v.name}
                  </h2>
                  <p className="text-ink-500 mt-2">{v.description}</p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-ink-700">
                    <span className="inline-flex items-center gap-1.5 bg-ink-50 rounded-full px-3 py-1">
                      <FaUserTie className="text-brand-500" /> {v.capacity}{" "}
                      Seater
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-ink-50 rounded-full px-3 py-1">
                      <FaSuitcase className="text-brand-500" /> {v.luggage} Bags
                    </span>
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <FaCheckCircle className="text-brand-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-4xl font-display font-extrabold text-brand-600">
                    {INR(v.rate_per_km)}
                    <span className="text-base font-medium text-ink-500">
                      {" "}
                      / km
                    </span>
                  </div>
                  <div className="text-xs text-ink-500 mt-1">
                    Base {INR(v.base_fare)} + Driver{" "}
                    {INR(v.driver_allowance)} + Night {INR(v.night_charge)}
                  </div>
                  <Link
                    href={`/booking?vehicle=${v.slug}`}
                    className="btn-primary mt-4"
                  >
                    Book {v.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
