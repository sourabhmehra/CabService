"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaPhoneAlt, FaWhatsapp, FaSpinner } from "react-icons/fa";
import { api, INR, type Booking } from "@/lib/api";
import { AGENCY } from "@/lib/config";

function Confirmation() {
  const sp = useSearchParams();
  const ref = sp.get("ref");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ref) {
      setError("Missing booking reference.");
      return;
    }
    api
      .getBooking(ref)
      .then(setBooking)
      .catch((e) => setError(e.message));
  }, [ref]);

  if (error) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Booking not found</h1>
        <p className="text-ink-500 mt-2">{error}</p>
        <Link href="/booking" className="btn-primary mt-6">
          Try again
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-px py-20 text-center text-ink-500">
        <FaSpinner className="animate-spin inline mr-2" /> Loading booking...
      </div>
    );
  }

  const wa = AGENCY.whatsapp.replace(/\D/g, "");
  const phone = AGENCY.phonePrimary.replace(/\s/g, "");

  return (
    <div className="bg-ink-50 min-h-screen">
      <section className="hero-bg text-white py-12">
        <div className="container-px text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500 grid place-items-center text-3xl">
            <FaCheckCircle />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold mt-4">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-ink-100/80">
            We&apos;ll call you on {booking.phone} shortly to confirm details.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
            Reference: <span className="font-bold">{booking.reference}</span>
          </div>
        </div>
      </section>

      <div className="container-px -mt-8 pb-16">
        <div className="card md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-display font-bold text-xl">Trip Details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row k="Trip Type" v={booking.trip_type.toUpperCase()} />
                <Row k="Pickup" v={booking.pickup} />
                <Row k="Drop" v={booking.drop_location} />
                <Row
                  k="Pickup Time"
                  v={new Date(booking.pickup_datetime).toLocaleString("en-IN")}
                />
                {booking.return_datetime && (
                  <Row
                    k="Return Time"
                    v={new Date(booking.return_datetime).toLocaleString("en-IN")}
                  />
                )}
                <Row k="Distance" v={`${booking.distance_km} km`} />
                <Row
                  k="Approx. Duration"
                  v={`${Math.round(booking.duration_min)} min`}
                />
                {booking.notes && <Row k="Notes" v={booking.notes} />}
              </dl>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Fare & Vehicle</h2>
              <div className="rounded-2xl bg-ink-900 text-white p-5 mt-4">
                <div className="text-xs text-ink-200/70">Vehicle</div>
                <div className="font-display font-bold text-lg">
                  {booking.vehicle.name}
                </div>
                <div className="text-xs text-ink-200/70 mt-4">
                  Estimated Total
                </div>
                <div className="font-display font-extrabold text-3xl text-brand-400">
                  {INR(booking.fare_estimate)}
                </div>
                <div className="text-xs text-ink-200/70 mt-1">
                  Rate {INR(booking.vehicle.rate_per_km)}/km · base{" "}
                  {INR(booking.vehicle.base_fare)} · driver{" "}
                  {INR(booking.vehicle.driver_allowance)}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phone}`}
                  className="btn-secondary"
                >
                  <FaPhoneAlt /> Call Us
                </a>
                <a
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(
                    `Hi, my booking ref is ${booking.reference}`
                  )}`}
                  className="btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>

              <div className="mt-6 rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm text-ink-700">
                <strong>Note:</strong> Final fare may vary slightly based on
                tolls, parking, night charges, or extra stops. Our team will
                confirm everything when they call you.
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/" className="btn-ghost">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-ink-100 pb-2">
      <dt className="text-ink-500">{k}</dt>
      <dd className="col-span-2 font-medium text-ink-900">{v}</dd>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="container-px py-20 text-center">
          <FaSpinner className="animate-spin inline mr-2" /> Loading...
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
