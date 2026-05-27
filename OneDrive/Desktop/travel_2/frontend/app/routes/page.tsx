import Link from "next/link";
import { FaMapMarkerAlt, FaClock, FaRoad } from "react-icons/fa";
import { INR, type PopularRoute } from "@/lib/api";
import { API_BASE } from "@/lib/config";

async function getRoutes(): Promise<PopularRoute[]> {
  try {
    const base = API_BASE || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/routes`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Popular Routes from Bhopal | Mehra Tour and Travel",
  description:
    "Outstation taxi routes from Bhopal — Indore, Ujjain, Sanchi, Pachmarhi, Khajuraho and more.",
};

export default async function RoutesPage() {
  const routes = await getRoutes();
  return (
    <>
      <section className="hero-bg text-white py-14">
        <div className="container-px">
          <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
            Popular Routes
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3">
            Bhopal&apos;s most-booked outstation trips
          </h1>
          <p className="mt-3 text-ink-100/85 max-w-2xl">
            Indicative one-way fares for our top routes. Final fare depends on
            actual route, vehicle and trip type.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.length === 0 && (
            <div className="md:col-span-3 card text-center text-ink-500">
              Start the API server to load routes.
            </div>
          )}
          {routes.map((r) => (
            <div key={r.id} className="card overflow-hidden p-0 flex flex-col">
              <div className="aspect-[16/10] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/route-${r.destination.toLowerCase()}.png`}
                  alt={r.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div>
                    <div className="text-xs text-brand-300 font-semibold uppercase tracking-wider">
                      {r.distance_km} km · ~{r.duration_hours.toFixed(1)} hrs
                    </div>
                    <div className="text-white font-display font-bold text-xl mt-1">
                      {r.origin} → {r.destination}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-lg">
                  {r.origin} → {r.destination}
                </h3>
                <p className="text-sm text-ink-500 mt-1 line-clamp-2">
                  {r.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-ink-700">
                  <span className="inline-flex items-center gap-1">
                    <FaRoad className="text-brand-500" /> {r.distance_km} km
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaClock className="text-brand-500" /> ~
                    {r.duration_hours.toFixed(1)} h
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FaMapMarkerAlt className="text-brand-500" /> One-way
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="rounded-lg bg-ink-50 py-2">
                    <div className="font-semibold text-ink-900">
                      {INR(r.sedan_price)}
                    </div>
                    <div className="text-ink-500">Dzire</div>
                  </div>
                  <div className="rounded-lg bg-ink-50 py-2">
                    <div className="font-semibold text-ink-900">
                      {INR(r.innova_price)}
                    </div>
                    <div className="text-ink-500">Innova</div>
                  </div>
                  <div className="rounded-lg bg-ink-50 py-2">
                    <div className="font-semibold text-ink-900">
                      {INR(r.tempo_price)}
                    </div>
                    <div className="text-ink-500">Tempo 17</div>
                  </div>
                </div>
                <Link
                  href={`/booking?pickup=${encodeURIComponent(
                    r.origin
                  )}&drop=${encodeURIComponent(r.destination)}`}
                  className="btn-primary mt-5"
                >
                  Book This Route
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
