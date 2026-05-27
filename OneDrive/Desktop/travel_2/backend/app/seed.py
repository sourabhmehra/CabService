"""Seed / sync the database with vehicles and popular Bhopal-region routes.

Uses upsert logic — safe to run on every startup.
Old vehicle slugs with no bookings are removed automatically.
"""

from sqlalchemy.orm import Session

from . import models

# ─── Vehicle catalogue (from official rate card) ─────────────────────────────
# Extra charges (applied on top of fare): Toll Tax, Parking,
# Driver Night ₹300 (small) / ₹500 (large), Minimum 250 km/day outstation.

VEHICLES_DATA = [
    {
        "slug": "dzire",
        "name": "Swift Dzire / Aura",
        "capacity": 4,
        "luggage": 2,
        "rate_per_km": 12.0,
        "base_fare": 200.0,
        "driver_allowance": 300.0,
        "night_charge": 300.0,
        "description": "Most economical AC sedan for 3–4 passengers. Ideal for city, airport and outstation trips.",
        "image_url": "/images/dzire.png",
        "features": "AC,Music System,4 Seater,2 Luggage Bags,Clean Interior",
    },
    {
        "slug": "ertiga",
        "name": "Maruti Ertiga",
        "capacity": 6,
        "luggage": 3,
        "rate_per_km": 14.0,
        "base_fare": 200.0,
        "driver_allowance": 300.0,
        "night_charge": 300.0,
        "description": "Spacious 6-seater MPV — more room than a sedan at a very affordable per-km rate.",
        "image_url": "/images/ertiga.png",
        "features": "AC,Music System,6 Seater,3 Luggage Bags,Extra Legroom",
    },
    {
        "slug": "innova",
        "name": "Toyota Innova",
        "capacity": 7,
        "luggage": 4,
        "rate_per_km": 16.0,
        "base_fare": 300.0,
        "driver_allowance": 400.0,
        "night_charge": 500.0,
        "description": "Most popular outstation SUV — powerful, comfortable and trusted by families across MP.",
        "image_url": "/images/innova.png",
        "features": "AC,Music System,7 Seater,4 Luggage Bags,Push-Back Seats",
    },
    {
        "slug": "innova-crysta",
        "name": "Toyota Innova Crysta",
        "capacity": 7,
        "luggage": 4,
        "rate_per_km": 18.0,
        "base_fare": 300.0,
        "driver_allowance": 400.0,
        "night_charge": 500.0,
        "description": "Premium Innova with upgraded interiors, better suspension and stronger engine for long journeys.",
        "image_url": "/images/innova-crysta.png",
        "features": "AC,Music System,7 Seater,4 Luggage Bags,Premium Interiors,Push-Back Seats",
    },
    {
        "slug": "winger-15",
        "name": "15 Seater Winger",
        "capacity": 15,
        "luggage": 8,
        "rate_per_km": 25.0,
        "base_fare": 500.0,
        "driver_allowance": 500.0,
        "night_charge": 500.0,
        "description": "15-seater AC Winger van — perfect for medium groups, school trips and corporate outings.",
        "image_url": "/images/winger.png",
        "features": "AC,Music System,15 Seater,8 Luggage Bags,Push-Back Seats",
    },
    {
        "slug": "tempo-17",
        "name": "Tempo Traveller (17 Seater)",
        "capacity": 17,
        "luggage": 10,
        "rate_per_km": 25.0,
        "base_fare": 500.0,
        "driver_allowance": 500.0,
        "night_charge": 500.0,
        "description": "17-seater AC Tempo Traveller for pilgrimages, weddings and large group outstation trips.",
        "image_url": "/images/tempo-17.png",
        "features": "AC,Music System,17 Seater,10 Luggage Bags,Recliner Seats,Charging Points",
    },
    {
        "slug": "tempo-26",
        "name": "Tempo Traveller (26 Seater)",
        "capacity": 26,
        "luggage": 15,
        "rate_per_km": 34.0,
        "base_fare": 800.0,
        "driver_allowance": 500.0,
        "night_charge": 500.0,
        "description": "26-seater large AC Tempo Traveller for big groups, school tours, yatras and large events.",
        "image_url": "/images/tempo-26.png",
        "features": "AC,Music System,26 Seater,15 Luggage Bags,Recliner Seats,Charging Points",
    },
    {
        "slug": "urbania",
        "name": "Force Urbania (17 Seater)",
        "capacity": 17,
        "luggage": 10,
        "rate_per_km": 35.0,
        "base_fare": 600.0,
        "driver_allowance": 500.0,
        "night_charge": 500.0,
        "description": "Premium luxury Force Urbania with high-end interiors — ideal for VIP group travel.",
        "image_url": "/images/urbania.png",
        "features": "AC,Music System,17 Seater,10 Luggage Bags,Luxury Interiors,Recliner Seats,Charging Points",
    },
]

# ─── Popular routes (prices: Dzire ₹12 | Innova ₹16 | Tempo-17 ₹25) ─────────
# Formula: base_fare + (distance × rate_per_km) + driver_allowance

ROUTES_DATA = [
    {
        "origin": "Bhopal", "destination": "Ujjain",
        "distance_km": 190, "duration_hours": 3.5,
        "sedan_price": 2780, "innova_price": 3740, "tempo_price": 5750,
        "description": "Mahakaleshwar Jyotirlinga darshan — Bhopal's most booked pilgrimage cab.",
    },
    {
        "origin": "Bhopal", "destination": "Sanchi",
        "distance_km": 46, "duration_hours": 1.2,
        "sedan_price": 1052, "innova_price": 1436, "tempo_price": 2150,
        "description": "UNESCO Buddhist stupa — perfect half-day trip from Bhopal.",
    },
    {
        "origin": "Bhopal", "destination": "Bhimbetka",
        "distance_km": 45, "duration_hours": 1.2,
        "sedan_price": 1040, "innova_price": 1420, "tempo_price": 2125,
        "description": "Prehistoric rock shelters — UNESCO World Heritage Site, just 45 km away.",
    },
    {
        "origin": "Bhopal", "destination": "Pachmarhi",
        "distance_km": 210, "duration_hours": 4.5,
        "sedan_price": 3020, "innova_price": 4060, "tempo_price": 6250,
        "description": "Satpura's queen hill station — ideal weekend trip from Bhopal.",
    },
    {
        "origin": "Bhopal", "destination": "Khajuraho",
        "distance_km": 375, "duration_hours": 7.5,
        "sedan_price": 5000, "innova_price": 6700, "tempo_price": 10375,
        "description": "World-famous temples and UNESCO heritage site in Bundelkhand.",
    },
    {
        "origin": "Bhopal", "destination": "Omkareshwar",
        "distance_km": 275, "duration_hours": 5.5,
        "sedan_price": 3800, "innova_price": 5100, "tempo_price": 7875,
        "description": "Sacred Jyotirlinga on the Narmada — very popular pilgrimage from Bhopal.",
    },
]


# Old slugs that must be removed and their replacement slug
# Bookings are re-assigned to the replacement so no data is lost.
LEGACY_SLUG_MAP = {
    "sedan": "dzire",
    "etios": "dzire",
    "innova-hycross": "innova-crysta",
}


def _migrate_legacy(db: Session) -> None:
    """Force-remove retired vehicle slugs; re-assign their bookings."""
    for old_slug, new_slug in LEGACY_SLUG_MAP.items():
        old = db.query(models.Vehicle).filter_by(slug=old_slug).first()
        if not old:
            continue
        new = db.query(models.Vehicle).filter_by(slug=new_slug).first()
        if new:
            db.query(models.Booking).filter_by(vehicle_id=old.id).update(
                {"vehicle_id": new.id}, synchronize_session=False
            )
        db.delete(old)
    db.commit()


def seed_vehicles(db: Session) -> None:
    """Upsert all vehicles; remove old slugs that have no bookings."""
    valid_slugs = [v["slug"] for v in VEHICLES_DATA]

    # Remove stale vehicles (old slugs) only if they have no bookings
    stale = (
        db.query(models.Vehicle)
        .filter(models.Vehicle.slug.notin_(valid_slugs))
        .all()
    )
    for v in stale:
        has_bookings = (
            db.query(models.Booking).filter_by(vehicle_id=v.id).count() > 0
        )
        if not has_bookings:
            db.delete(v)

    # Upsert current vehicles
    for data in VEHICLES_DATA:
        v = db.query(models.Vehicle).filter_by(slug=data["slug"]).first()
        if v:
            for key, val in data.items():
                setattr(v, key, val)
        else:
            db.add(models.Vehicle(**data))

    db.commit()


def seed_routes(db: Session) -> None:
    """Upsert popular routes; remove destinations no longer in the list."""
    valid_destinations = [d["destination"] for d in ROUTES_DATA]

    # Remove routes not in current list
    db.query(models.PopularRoute).filter(
        models.PopularRoute.destination.notin_(valid_destinations)
    ).delete(synchronize_session=False)

    for data in ROUTES_DATA:
        r = (
            db.query(models.PopularRoute)
            .filter_by(origin=data["origin"], destination=data["destination"])
            .first()
        )
        if r:
            for key, val in data.items():
                setattr(r, key, val)
        else:
            db.add(models.PopularRoute(
                image_url=f"/images/route-{data['destination'].lower()}.png",
                **data
            ))
    db.commit()


def run_seed(db: Session) -> None:
    seed_vehicles(db)
    _migrate_legacy(db)   # force-remove old slugs like "sedan", "etios"
    seed_routes(db)
