import { FaStar } from "react-icons/fa";
import { API_BASE } from "@/lib/config";
import ReviewForm from "@/components/ReviewForm";
import type { Review } from "@/lib/api";

export const metadata = {
  title: "Customer Reviews | Mehra Tour and Travel",
  description:
    "Read genuine reviews from customers who booked cabs with Mehra Tour and Travel, Bhopal.",
};

async function getReviews(): Promise<Review[]> {
  try {
    const base = API_BASE || "http://127.0.0.1:8000";
    const res = await fetch(`${base}/api/reviews`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < rating ? "text-brand-500" : "text-ink-200"}
        />
      ))}
    </div>
  );
}

function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const avg = averageRating(reviews);

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="hero-bg text-white py-14">
        <div className="container-px">
          <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
            Customer Reviews
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3">
            What our passengers say
          </h1>
          <p className="mt-3 text-ink-100/80 max-w-xl">
            Honest reviews from real customers who travelled with Mehra Tour
            and Travel.
          </p>

          {avg && (
            <div className="flex flex-wrap items-center gap-6 mt-6">
              <div className="text-center">
                <div className="font-display text-6xl font-extrabold text-brand-400">
                  {avg}
                </div>
                <div className="flex gap-1 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className="text-brand-400" />
                  ))}
                </div>
                <div className="text-ink-100/70 text-sm mt-1">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex-1 max-w-xs space-y-1">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="text-ink-100/70 w-3">{star}</span>
                    <FaStar className="text-brand-400 text-xs" />
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-400 h-full rounded-full"
                        style={{
                          width:
                            reviews.length > 0
                              ? `${(count / reviews.length) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-ink-100/60 w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-px grid lg:grid-cols-3 gap-8 items-start">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="card text-center py-16 text-ink-500">
                No reviews yet — be the first to share your experience!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="card">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="font-semibold text-ink-900">
                        {r.customer_name}
                      </div>
                      {r.trip_description && (
                        <div className="text-xs text-ink-500 mt-0.5">
                          {r.trip_description}
                        </div>
                      )}
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  <p className="text-ink-700 mt-3 leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                  <div className="text-xs text-ink-400 mt-3">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky review form */}
          <div className="lg:sticky lg:top-24">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
