"use client";

import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { api } from "@/lib/api";

interface Props {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [trip, setTrip] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.createReview({
        customer_name: name,
        trip_description: trip.trim() || undefined,
        rating,
        comment,
      });
      setSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="card text-center py-12">
        <FaCheckCircle className="text-brand-500 text-5xl mx-auto" />
        <h3 className="font-display font-bold text-xl mt-5">Thank you!</h3>
        <p className="text-ink-500 mt-2 max-w-xs mx-auto">
          Your review has been submitted. It helps other travellers make better choices.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <h3 className="font-display font-bold text-xl">Write a Review</h3>
        <p className="text-sm text-ink-500 mt-1">
          Share your experience with Mehra Tour and Travel
        </p>
      </div>

      {/* Star rating */}
      <div>
        <label className="label">Your Rating *</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="text-3xl transition-colors focus:outline-none"
            >
              <FaStar
                className={
                  (hover || rating) >= star
                    ? "text-brand-500"
                    : "text-ink-200"
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-ink-500">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="rev-name" className="label">
          Your Name *
        </label>
        <input
          id="rev-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul Sharma"
          className="input"
        />
      </div>

      {/* Trip description */}
      <div>
        <label htmlFor="rev-trip" className="label">
          Trip Description{" "}
          <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input
          id="rev-trip"
          value={trip}
          onChange={(e) => setTrip(e.target.value)}
          placeholder="e.g. Bhopal → Ujjain (Innova Crysta)"
          className="input"
        />
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="rev-comment" className="label">
          Your Review *
        </label>
        <textarea
          id="rev-comment"
          required
          minLength={10}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell others about your experience — driver behaviour, punctuality, comfort…"
          className="input resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
