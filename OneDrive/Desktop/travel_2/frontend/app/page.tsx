import Link from "next/link";
import {
  FaShieldAlt,
  FaRupeeSign,
  FaUserTie,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaStar,
  FaPhoneAlt,
  FaClock,
  FaCar,
  FaSuitcase,
} from "react-icons/fa";
import BookingWidget from "@/components/BookingWidget";
import { AGENCY, API_BASE } from "@/lib/config";
import { INR, type PopularRoute, type Vehicle, type Review } from "@/lib/api";

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const base = API_BASE || "http://127.0.0.1:8000";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000); // 8s timeout
    const res = await fetch(`${base}${path}`, {
      next: { revalidate: 300 }, // cache 5 min — fast for visitors
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback; // backend sleeping? show page anyway
  }
}

const FALLBACK_REVIEWS: Review[] = [
  { id: 0, customer_name: "Ankit Sharma",  trip_description: "Bhopal → Indore (Sedan)",   rating: 5, comment: "Excellent service! Driver was on time and the car was very clean. Will book again.",                        created_at: "" },
  { id: 0, customer_name: "Priya Verma",   trip_description: "Bhopal → Pachmarhi (Innova)", rating: 5, comment: "Smooth ride for our family trip. Fair pricing and very polite driver.",                                  created_at: "" },
  { id: 0, customer_name: "Rahul Tiwari",  trip_description: "Corporate group (Tempo)",   rating: 5, comment: "Booked a Tempo Traveller for our office tour — comfortable and well managed.",                            created_at: "" },
];

export default async function HomePage() {
  const [vehicles, routes, apiReviews] = await Promise.all([
    safeFetch<Vehicle[]>("/api/vehicles", []),
    safeFetch<PopularRoute[]>("/api/routes", []),
    safeFetch<Review[]>("/api/reviews", []),
  ]);
  const reviews = apiReviews.length > 0 ? apiReviews.slice(0, 3) : FALLBACK_REVIEWS;

  return (
    <>
      {/* Hero */}
      <section className="hero-bg text-white">
        <div className="container-px py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
              <FaStar /> 4.9 / 5 · 5000+ Happy Customers
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mt-5 leading-tight">
              Bhopal&apos;s Most Trusted
              <span className="text-brand-400"> Taxi Service</span>
            </h1>
            <p className="mt-5 text-lg text-ink-100/85 max-w-xl">
              Book one-way, round-trip and local taxis from {AGENCY.name}.
              Dzire, Ertiga, Innova, Crysta and Tempo Traveller at transparent per-km pricing —
              available 24×7 across Madhya Pradesh.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/booking" className="btn-primary">
                <FaCar /> Book a Cab
              </Link>
              <a
                href={`tel:${AGENCY.phonePrimary.replace(/\s/g, "")}`}
                className="btn-secondary"
              >
                <FaPhoneAlt /> {AGENCY.phonePrimary}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-10 max-w-md">
              {[
                { v: "10+", l: "Years Experience" },
                { v: "50+", l: "Premium Cabs" },
                { v: "24×7", l: "Available" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-display text-2xl font-extrabold text-brand-300">
                    {s.v}
                  </div>
                  <div className="text-xs text-ink-100/70">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container-px">
          <div className="text-center mb-12">
            <span className="pill">Why Choose Us</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Reliable. Transparent. On time, every time.
            </h2>
            <p className="text-ink-500 mt-3 max-w-2xl mx-auto">
              {AGENCY.name} has been serving Bhopal travellers since over a
              decade. We combine well-maintained vehicles, experienced drivers
              and fair per-kilometre fares.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <FaRupeeSign />,
                t: "Transparent Pricing",
                d: "No hidden charges. Fixed per-km rates for all vehicles — Dzire to Tempo Traveller.",
              },
              {
                icon: <FaUserTie />,
                t: "Verified Drivers",
                d: "Licensed, experienced and well-mannered drivers who know every route.",
              },
              {
                icon: <FaShieldAlt />,
                t: "Safety First",
                d: "Sanitised, well-maintained cars with GPS tracking and 24×7 support.",
              },
              {
                icon: <FaMapMarkedAlt />,
                t: "Pan-MP Coverage",
                d: "All major MP cities, pilgrimage sites and hill stations covered.",
              },
            ].map((b) => (
              <div key={b.t} className="card hover:-translate-y-1 transition">
                <div className="w-12 h-12 grid place-items-center rounded-xl bg-brand-50 text-brand-600 text-xl">
                  {b.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mt-4">
                  {b.t}
                </h3>
                <p className="text-sm text-ink-500 mt-2">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="section bg-ink-50">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
            <div>
              <span className="pill">Our Fleet</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
                Choose your ride
              </h2>
              <p className="text-ink-500 mt-2">
                Per-km rates — Dzire ₹12 · Ertiga ₹14 · Innova ₹16 · Crysta ₹18 · Tempo 17 ₹25 · Tempo 26 ₹34 · Urbanaria ₹35.
              </p>
            </div>
            <Link href="/fleet" className="btn-secondary">
              View All Vehicles
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {vehicles.length === 0 ? (
              <div className="md:col-span-3 card text-center text-ink-500">
                Start the API server to load fleet details.
              </div>
            ) : (
              vehicles.map((v) => (
                <div
                  key={v.slug}
                  className="card hover:-translate-y-1 transition flex flex-col"
                >
                  <div className="rounded-xl overflow-hidden border border-ink-100 bg-brand-50">
                    {v.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.image_url} alt={v.name} className="w-full" />
                    ) : null}
                  </div>
                  <h3 className="font-display font-bold text-xl mt-4">
                    {v.name}
                  </h3>
                  <p className="text-sm text-ink-500 mt-1 line-clamp-2">
                    {v.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm text-ink-700">
                    <span className="inline-flex items-center gap-1.5">
                      <FaUserTie className="text-brand-500" /> {v.capacity}{" "}
                      Seater
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FaSuitcase className="text-brand-500" /> {v.luggage} Bags
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FaClock className="text-brand-500" /> 24×7
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-display font-bold text-brand-600">
                        {INR(v.rate_per_km)}
                        <span className="text-sm font-medium text-ink-500">
                          {" "}
                          / km
                        </span>
                      </div>
                      <div className="text-xs text-ink-500">
                        + base {INR(v.base_fare)} · driver{" "}
                        {INR(v.driver_allowance)}
                      </div>
                    </div>
                    <Link
                      href={`/booking?vehicle=${v.slug}`}
                      className="btn-primary"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Routes */}
      <section className="section">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-10">
            <div>
              <span className="pill">Popular Routes</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
                Bhopal&apos;s most-booked trips
              </h2>
              <p className="text-ink-500 mt-2">
                Fixed package prices for our top outstation routes.
              </p>
            </div>
            <Link href="/routes" className="btn-secondary">
              All Routes
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.length === 0 ? (
              <div className="md:col-span-3 card text-center text-ink-500">
                Start the API server to load popular routes.
              </div>
            ) : (
              routes.slice(0, 6).map((r) => (
                <div
                  key={r.id}
                  className="card hover:-translate-y-1 transition overflow-hidden p-0"
                >
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
                        <div className="text-white font-display font-bold text-lg mt-0.5">
                          {r.origin} → {r.destination}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg">
                        {r.origin} → {r.destination}
                      </h3>
                      <span className="text-xs text-ink-500">
                        {r.distance_km} km
                      </span>
                    </div>
                    <p className="text-sm text-ink-500 mt-1 line-clamp-2">
                      {r.description}
                    </p>
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
                      className="btn-primary mt-5 w-full"
                    >
                      Book This Route
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-ink-50">
        <div className="container-px">
          <div className="text-center mb-12">
            <span className="pill">How it works</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Book your taxi in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "1",
                t: "Enter Trip Details",
                d: "Choose trip type, enter pickup & drop locations along with date and time.",
              },
              {
                n: "2",
                t: "Get Live Fare Quote",
                d: "We calculate distance using maps and show transparent per-km fares for every vehicle.",
              },
              {
                n: "3",
                t: "Confirm & Travel",
                d: "Share your contact details, confirm the booking, and our driver picks you up.",
              },
            ].map((s) => (
              <div key={s.n} className="card text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-500 text-white grid place-items-center font-display text-2xl font-bold">
                  {s.n}
                </div>
                <h3 className="font-display font-semibold text-lg mt-4">
                  {s.t}
                </h3>
                <p className="text-sm text-ink-500 mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-12">
            <div className="text-center sm:text-left">
              <span className="pill">Customer Reviews</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
                What our passengers say
              </h2>
            </div>
            <Link href="/reviews" className="btn-secondary">
              All Reviews &amp; Write a Review
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, idx) => (
              <div key={r.id || idx} className="card">
                <div className="flex gap-1 text-brand-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < r.rating ? "text-brand-500" : "text-ink-200"} />
                  ))}
                </div>
                <p className="text-ink-700 mt-3">&ldquo;{r.comment}&rdquo;</p>
                <div className="mt-4">
                  <div className="font-semibold">{r.customer_name}</div>
                  {r.trip_description && (
                    <div className="text-xs text-ink-500">{r.trip_description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/reviews" className="btn-primary">
              Read All Reviews &amp; Share Your Experience
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ink-900 text-white">
        <div className="container-px grid md:grid-cols-2 items-center gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Ready to ride with {AGENCY.shortName}?
            </h2>
            <p className="mt-3 text-ink-100/80">
              24×7 booking and customer support. Get a fare quote in seconds.
            </p>
            <ul className="mt-5 space-y-2 text-ink-100/85 text-sm">
              <li className="flex gap-2"><FaCheckCircle className="text-brand-400 mt-1"/> Instant fare estimate from real driving distance.</li>
              <li className="flex gap-2"><FaCheckCircle className="text-brand-400 mt-1"/> Choose from 8 vehicles — Dzire to 26-seater Tempo Traveller.</li>
              <li className="flex gap-2"><FaCheckCircle className="text-brand-400 mt-1"/> Pay only on completion — no upfront charges.</li>
            </ul>
          </div>
          <div className="bg-white text-ink-900 rounded-2xl p-6 shadow-soft">
            <BookingWidget compact />
          </div>
        </div>
      </section>
    </>
  );
}
