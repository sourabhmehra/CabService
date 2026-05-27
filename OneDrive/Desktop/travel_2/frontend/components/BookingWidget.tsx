"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaCalendarAlt, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import LocationInput from "@/components/LocationInput";

const TRIP_TYPES = [
  { value: "oneway", label: "One Way" },
  { value: "roundtrip", label: "Round Trip" },
  { value: "local", label: "Local (Bhopal)" },
  { value: "airport", label: "Airport Transfer" },
];

export default function BookingWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [trip, setTrip] = useState("oneway");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pickup.trim() || !drop.trim()) {
      setError("Please enter both pickup and drop locations.");
      return;
    }
    if (!date) {
      setError("Please select pickup date.");
      return;
    }
    const params = new URLSearchParams({
      trip,
      pickup,
      drop,
      date,
      time,
    });
    if (trip === "roundtrip" && returnDate) params.set("return", returnDate);
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`card ${compact ? "" : "md:p-8"} bg-white text-ink-900`}
    >
      <div className="flex flex-wrap gap-2 mb-5">
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
            {t.value === "oneway" && <FaLocationArrow className="inline mr-1.5 -mt-0.5" />}
            {t.value === "roundtrip" && <FaCar className="inline mr-1.5 -mt-0.5" />}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LocationInput
          id="widget-pickup"
          value={pickup}
          onChange={setPickup}
          placeholder="e.g. MP Nagar, Bhopal"
          required
          label={
            <><FaMapMarkerAlt className="inline mr-1 text-brand-500" /> Pickup Location</>
          }
        />

        <LocationInput
          id="widget-drop"
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
            <FaCalendarAlt className="inline mr-1 text-brand-500" /> Pickup Date
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

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary mt-6 w-full md:w-auto">
        Search Cabs & Fares
      </button>
    </form>
  );
}
