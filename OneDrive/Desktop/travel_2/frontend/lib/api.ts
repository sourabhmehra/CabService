import { API_BASE } from "./config";

export type Vehicle = {
  id: number;
  slug: string;
  name: string;
  capacity: number;
  luggage: number;
  rate_per_km: number;
  base_fare: number;
  driver_allowance: number;
  night_charge: number;
  description?: string | null;
  image_url?: string | null;
  features?: string | null;
};

export type GeocodeResult = { display_name: string; lat: number; lon: number };

export type FareItem = {
  vehicle: Vehicle;
  distance_km: number;
  duration_min: number;
  base_fare: number;
  distance_fare: number;
  driver_allowance: number;
  total: number;
};

export type FareQuote = {
  pickup: GeocodeResult;
  drop: GeocodeResult;
  distance_km: number;
  duration_min: number;
  trip_type: string;
  quotes: FareItem[];
};

export type PopularRoute = {
  id: number;
  origin: string;
  destination: string;
  distance_km: number;
  duration_hours: number;
  sedan_price: number;
  innova_price: number;
  tempo_price: number;
  image_url?: string | null;
  description?: string | null;
};

export type Booking = {
  id: number;
  reference: string;
  name: string;
  phone: string;
  email?: string | null;
  pickup: string;
  drop_location: string;
  pickup_datetime: string;
  return_datetime?: string | null;
  trip_type: string;
  distance_km: number;
  duration_min: number;
  fare_estimate: number;
  status: string;
  notes?: string | null;
  created_at: string;
  vehicle: Vehicle;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      detail = j.detail || detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}

export const api = {
  vehicles: () => request<Vehicle[]>("/api/vehicles"),
  vehicle: (slug: string) => request<Vehicle>(`/api/vehicles/${slug}`),
  routes: () => request<PopularRoute[]>("/api/routes"),
  quote: (payload: { pickup: string; drop: string; trip_type: string }) =>
    request<FareQuote>("/api/quote", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createBooking: (payload: {
    name: string;
    phone: string;
    email?: string;
    pickup: string;
    drop: string;
    pickup_datetime: string;
    return_datetime?: string;
    trip_type: string;
    vehicle_slug: string;
    notes?: string;
  }) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getBooking: (reference: string) =>
    request<Booking>(`/api/bookings/${reference}`),
  contact: (payload: {
    name: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
  }) =>
    request<unknown>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
