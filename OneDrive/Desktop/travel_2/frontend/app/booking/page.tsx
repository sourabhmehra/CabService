"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaCalendarAlt,
  FaCar,
  FaUserTie,
  FaSuitcase,
  FaCheck,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import LocationInput from "@/components/LocationInput";
import {
  api,
  INR,
  type FareItem,
  type FareQuote,
  type Booking,
} from "@/lib/api";

const TRIP_TYPES = [
  { value: "oneway", label: "One Way" },
  { value: "roundtrip", label: "Round Trip" },
  { value: "local", label: "Local (Bhopal)" },
  { value: "airport", label: "Airport Transfer" },
];

function BookingFlow() {
  const router = useRouter();
  const sp = useSearchParams();

  const [trip, setTrip] = useState(sp.get("trip") || "oneway");
  const [pickup, setPickup] = useState(sp.get("pickup") || "");
  const [drop, setDrop] = useState(sp.get("drop") || "");
  const [date, setDate] = useState(sp.get("date") || "");
  const [time, setTime] = useState(sp.get("time") || "10:00");
  const [returnDate, setReturnDate] = useState(sp.get("return") || "");
  const [preselect] = useState(sp.get("vehicle") || "");

  const [quote, setQuote] = useState<FareQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSlug, setSelectedSlug] = useState<string>(preselect);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const ready = pickup.trim() && drop.trim() && date;

  const onQuote = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!ready) {
      setError("Please fill pickup, drop and pickup date.");
      return;
    }
    setError(null);
    setQuote(null);
    setLoadingQuote(true);
    try {
      const q = await api.quote({
        pickup,
        drop,
        trip_type: trip,
      });
      setQuote(q);
      if (!selectedSlug && q.quotes.length) {
        setSelectedSlug(q.quotes[0].vehicle.slug);
      }
    } catch (err: any) {
      setError(err.message || "Could not get fare quote.");
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    if (ready && !quote && !loadingQuote) {
      onQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected: FareItem | undefined = useMemo(
    () => quote?.quotes.find((q) => q.vehicle.slug === selectedSlug),
    [quote, selectedSlug]
  );

  const onConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote || !selected) {
      setError("Please fetch a quote and choose a vehicle first.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const pickupDt = new Date(`${date}T${time || "10:00"}:00`).toISOString();
      const returnDt =
        trip === "roundtrip" && returnDate
          ? new Date(`${returnDate}T${time || "10:00"}:00`).toISOString()
          : undefined;
      const b = await api.createBooking({
        name,
        phone,
        email: email || undefined,
        pickup,
        drop,
        pickup_datetime: pickupDt,
        return_datetime: returnDt,
        trip_type: trip,
        vehicle_slug: selected.vehicle.slug,
        notes: notes || undefined,
      });
      setBooking(b);
      router.push(`/booking/confirmation?ref=${b.reference}`);
    } catch (err: any) {
      setError(err.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ink-50 min-h-screen">
      <section className="hero-bg text-white py-10">
        <div className="container-px">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">
            Book Your Taxi
          </h1>
          <p className="text-ink-100/80 mt-2">
            Enter trip details, get a live fare quote, and confirm.
          </p>
        </div>
      </section>

      <div className="container-px -mt-8 pb-16">
        <div className="card md:p-8">
          <form onSubmit={onQuote} className="grid gap-5">
            <div className="flex flex-wrap gap-2">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTrip(t.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    trip === t.value
                      ? "bg-brand-500 text-white shadow-soft"
                      : "bg-ink-100 text-ink-700 hover:bg-ink-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <LocationInput
                id="booking-pickup"
                value={pickup}
                onChange={setPickup}
                placeholder="e.g. MP Nagar, Bhopal"
                required
                label={
                  <><FaMapMarkerAlt className="inline mr-1 text-brand-500" /> Pickup Location</>
                }
              />
              <LocationInput
                id="booking-drop"
                value={drop}
                onChange={setDrop}
                placeholder="e.g. Ujjain"
                required
                label={
                  <><FaLocationArrow className="inline mr-1 text-brand-500" /> Drop Location</>
                }
              />
              <div>
                <label className="label">
                  <FaCalendarAlt className="inline mr-1 text-brand-500" />{" "}
                  Pickup Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Pickup Time</label>
                  <input
                    type="time"
                    className="input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                {trip === "roundtrip" && (
                  <div>
                    <label className="label">Return Date</label>
                    <input
                      type="date"
                      className="input"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={loadingQuote}
              >
                {loadingQuote ? (
                  <>
                    <FaSpinner className="animate-spin" /> Calculating...
                  </>
                ) : (
                  <>Get Fare Quote</>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {quote && (
            <div className="mt-8">
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm grid md:grid-cols-3 gap-3">
                <div>
                  <div className="text-ink-500 text-xs">Pickup</div>
                  <div className="font-medium text-ink-900 line-clamp-1">
                    {quote.pickup.display_name}
                  </div>
                </div>
                <div>
                  <div className="text-ink-500 text-xs">Drop</div>
                  <div className="font-medium text-ink-900 line-clamp-1">
                    {quote.drop.display_name}
                  </div>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="text-ink-500 text-xs">Distance</div>
                    <div className="font-bold text-ink-900">
                      {quote.distance_km} km
                    </div>
                  </div>
                  <div>
                    <div className="text-ink-500 text-xs">Approx. Time</div>
                    <div className="font-bold text-ink-900">
                      {Math.round(quote.duration_min)} min
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl mt-7">
                Choose a Vehicle
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {quote.quotes.map((q) => {
                  const active = selectedSlug === q.vehicle.slug;
                  return (
                    <button
                      type="button"
                      key={q.vehicle.slug}
                      onClick={() => setSelectedSlug(q.vehicle.slug)}
                      className={`text-left rounded-2xl border-2 transition p-5 bg-white ${
                        active
                          ? "border-brand-500 shadow-soft"
                          : "border-ink-100 hover:border-brand-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-display font-bold text-lg">
                          {q.vehicle.name}
                        </div>
                        {active && (
                          <span className="text-brand-600">
                            <FaCheckCircle />
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-ink-500 mt-2">
                        <span className="inline-flex items-center gap-1">
                          <FaUserTie className="text-brand-500" />{" "}
                          {q.vehicle.capacity}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FaSuitcase className="text-brand-500" />{" "}
                          {q.vehicle.luggage}
                        </span>
                        <span>₹{q.vehicle.rate_per_km}/km</span>
                      </div>
                      <div className="mt-3 text-3xl font-display font-extrabold text-brand-600">
                        {INR(q.total)}
                      </div>
                      <div className="text-xs text-ink-500">
                        Base {INR(q.base_fare)} · Distance{" "}
                        {INR(q.distance_fare)} · Driver{" "}
                        {INR(q.driver_allowance)}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contact / Confirm */}
              <form onSubmit={onConfirm} className="mt-10 grid gap-4">
                <h3 className="font-display font-bold text-xl">
                  Your Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      className="input"
                      type="tel"
                      placeholder="+91 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      className="input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Notes / Special Requests</label>
                    <input
                      className="input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Child seat, extra stops, etc."
                    />
                  </div>
                </div>

                {selected && (
                  <div className="rounded-2xl bg-ink-900 text-white p-5 grid md:grid-cols-3 gap-4 items-center">
                    <div>
                      <div className="text-xs text-ink-200/70">
                        Selected Vehicle
                      </div>
                      <div className="font-display font-bold text-lg">
                        {selected.vehicle.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-200/70">Distance</div>
                      <div className="font-bold">{selected.distance_km} km</div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-200/70">
                        Estimated Total
                      </div>
                      <div className="font-display font-extrabold text-2xl text-brand-400">
                        {INR(selected.total)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submitting || !selected}
                  >
                    {submitting ? (
                      <>
                        <FaSpinner className="animate-spin" /> Booking...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="container-px py-20 text-center">
          <FaSpinner className="animate-spin inline mr-2" /> Loading...
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}
