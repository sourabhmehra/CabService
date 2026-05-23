# Mehra Tour and Travel — Taxi Booking App

Full-stack taxi booking website for **Mehra Tour and Travel**, a Bhopal-based travel agency. Inspired by thetaxiwalaa.com.

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend:** FastAPI (Python) + SQLAlchemy
- **Database:** SQLite (auto-created on first run)
- **Maps & Distance:** OpenStreetMap (Nominatim for geocoding + OSRM for routing) — **100% free, no API key**

---

## Features

- Hero landing page with live booking widget
- Trip types: One-way, Round-trip, Local, Airport transfer
- Live fare quote: enter pickup + drop → real driving distance via OSRM → instant per-vehicle pricing
- Vehicle catalog: Sedan (₹9/km), Innova (₹11/km), Tempo Traveller (₹15/km)
- Booking flow with confirmation page and reference number
- Popular Bhopal routes (Indore, Ujjain, Sanchi, Pachmarhi, Khajuraho, Omkareshwar, Jabalpur, Bhimbetka)
- Contact form, About page, Fleet page, Routes page
- Floating Call + WhatsApp buttons
- Responsive (mobile-first) design

---

## Pricing model

| Vehicle | Per-km rate | Base fare | Driver allowance | Night charge |
| --- | --- | --- | --- | --- |
| Sedan (Dzire / Etios) | ₹9 | ₹200 | ₹300 | ₹250 |
| Toyota Innova | ₹11 | ₹300 | ₹400 | ₹300 |
| Tempo Traveller | ₹15 | ₹500 | ₹500 | ₹400 |

Round trips multiply distance × 2. All values are configurable in `backend/app/seed.py`.

---

## Running locally (Windows)

### Quick start

```cmd
:: 1. Start the backend (in one terminal)
start-backend.bat

:: 2. Start the frontend (in another terminal)
start-frontend.bat
```

Then open **http://localhost:3000**.

The Next.js app proxies `/api/*` to the FastAPI backend at `http://127.0.0.1:8000`. API docs are at **http://127.0.0.1:8000/docs**.

### Manual setup

**Backend:**

```cmd
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

**Frontend:**

```cmd
cd frontend
npm install
npm run dev
```

---

## Project structure

```
travel_2/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + routes
│   │   ├── models.py        # SQLAlchemy models (Vehicle, Booking, Contact, Routes)
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── database.py      # SQLite engine + session
│   │   ├── maps.py          # Nominatim + OSRM clients
│   │   ├── pricing.py       # Fare calculation
│   │   └── seed.py          # Initial vehicles & popular routes
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── app/
│   │   ├── page.tsx                       # Home
│   │   ├── booking/page.tsx               # Booking flow
│   │   ├── booking/confirmation/page.tsx  # Confirmation
│   │   ├── fleet/page.tsx                 # Vehicles
│   │   ├── routes/page.tsx                # Popular routes
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── layout.tsx + globals.css
│   ├── components/                        # Navbar, Footer, BookingWidget, FloatingCallButton
│   ├── lib/                               # api client + config
│   ├── public/images/                     # SVG illustrations
│   ├── tailwind.config.ts
│   ├── next.config.js                     # Rewrites /api/* → FastAPI
│   └── package.json
└── README.md
```

---

## API endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/vehicles` | List all vehicles & per-km rates |
| GET | `/api/vehicles/{slug}` | Vehicle detail |
| GET | `/api/routes` | Popular Bhopal outstation routes |
| POST | `/api/distance` | `{ pickup, drop }` → distance/duration via OSRM |
| POST | `/api/quote` | `{ pickup, drop, trip_type }` → distance + fare per vehicle |
| POST | `/api/bookings` | Create a booking — returns reference |
| GET | `/api/bookings/{reference}` | Fetch booking by reference |
| GET | `/api/bookings` | List recent bookings (admin / dashboard) |
| POST | `/api/contact` | Submit contact form |

OpenAPI docs: **`/docs`**.

---

## Customisation

- **Agency details (phone, address, etc.):** `frontend/lib/config.ts`
- **Vehicle rates & fleet:** `backend/app/seed.py` (delete `backend/mehra_travels.db` to re-seed)
- **Popular routes:** also in `backend/app/seed.py`
- **Theme colors / fonts:** `frontend/tailwind.config.ts`

---

## Notes on the free map API

- We use **Nominatim** for geocoding and **OSRM** for routing. Both are open and free, but rate limits are modest (~1 req/sec per IP for Nominatim). For production traffic, host your own Nominatim/OSRM instance or switch to a paid provider (Google Distance Matrix, Mapbox, OpenRouteService).
- Be specific in location strings (e.g. `"MP Nagar, Bhopal"` not just `"MP Nagar"`).

---

## License

Private — built for Mehra Tour and Travel.
