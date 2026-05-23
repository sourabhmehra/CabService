"""Seed the database with vehicles and popular Bhopal-region routes."""

from sqlalchemy.orm import Session

from . import models


def seed_vehicles(db: Session) -> None:
    existing = db.query(models.Vehicle).count()
    if existing:
        return

    vehicles = [
        models.Vehicle(
            slug="sedan",
            name="Sedan (Dzire / Etios)",
            capacity=4,
            luggage=2,
            rate_per_km=9.0,
            base_fare=200.0,
            driver_allowance=300.0,
            night_charge=250.0,
            description="Comfortable AC sedan ideal for 3-4 passengers. Best for city trips and short outstation runs.",
            image_url="/images/sedan.svg",
            features="AC,Music System,4 Seater,2 Luggage,Clean Interior",
        ),
        models.Vehicle(
            slug="innova",
            name="Toyota Innova",
            capacity=6,
            luggage=4,
            rate_per_km=11.0,
            base_fare=300.0,
            driver_allowance=400.0,
            night_charge=300.0,
            description="Spacious 6+1 SUV — the most popular outstation choice for families and small groups.",
            image_url="/images/innova.svg",
            features="AC,Music System,6+1 Seater,4 Luggage,Push-Back Seats",
        ),
        models.Vehicle(
            slug="tempo-traveller",
            name="Tempo Traveller",
            capacity=12,
            luggage=8,
            rate_per_km=15.0,
            base_fare=500.0,
            driver_allowance=500.0,
            night_charge=400.0,
            description="12-seater AC Tempo Traveller perfect for large groups, weddings, corporate outings and pilgrimages.",
            image_url="/images/tempo.svg",
            features="AC,Music System,12 Seater,8 Luggage,Recliner Seats,Charging Points",
        ),
    ]
    db.add_all(vehicles)
    db.commit()


def seed_routes(db: Session) -> None:
    existing = db.query(models.PopularRoute).count()
    if existing:
        return

    # Distances are approximate driving distances from Bhopal.
    routes = [
        models.PopularRoute(
            origin="Bhopal",
            destination="Indore",
            distance_km=195,
            duration_hours=3.5,
            sedan_price=2055,
            innova_price=2845,
            tempo_price=3725,
            image_url="/images/route-indore.svg",
            description="Popular business and shopping route — comfortable 3.5 hour drive.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Ujjain",
            distance_km=190,
            duration_hours=3.5,
            sedan_price=2010,
            innova_price=2790,
            tempo_price=3650,
            image_url="/images/route-ujjain.svg",
            description="Mahakaleshwar Jyotirlinga darshan — favourite pilgrimage cab.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Sanchi",
            distance_km=46,
            duration_hours=1.2,
            sedan_price=614,
            innova_price=806,
            tempo_price=1190,
            image_url="/images/route-sanchi.svg",
            description="UNESCO Buddhist stupa — perfect half-day trip from Bhopal.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Bhimbetka",
            distance_km=45,
            duration_hours=1.2,
            sedan_price=605,
            innova_price=795,
            tempo_price=1175,
            image_url="/images/route-bhimbetka.svg",
            description="Prehistoric rock shelters — UNESCO World Heritage Site.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Pachmarhi",
            distance_km=210,
            duration_hours=4.5,
            sedan_price=2190,
            innova_price=3010,
            tempo_price=3950,
            image_url="/images/route-pachmarhi.svg",
            description="Hill station getaway — Satpura's queen, ideal weekend trip.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Khajuraho",
            distance_km=375,
            duration_hours=7.5,
            sedan_price=3575,
            innova_price=4825,
            tempo_price=6125,
            image_url="/images/route-khajuraho.svg",
            description="World-famous temples and UNESCO heritage site.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Omkareshwar",
            distance_km=275,
            duration_hours=5.5,
            sedan_price=2775,
            innova_price=3825,
            tempo_price=4925,
            image_url="/images/route-omkareshwar.svg",
            description="Sacred Jyotirlinga on the Narmada — popular pilgrimage route.",
        ),
        models.PopularRoute(
            origin="Bhopal",
            destination="Jabalpur",
            distance_km=310,
            duration_hours=6.0,
            sedan_price=3090,
            innova_price=4210,
            tempo_price=5350,
            image_url="/images/route-jabalpur.svg",
            description="Marble rocks & Bhedaghat — beautiful river-city.",
        ),
    ]
    db.add_all(routes)
    db.commit()


def run_seed(db: Session) -> None:
    seed_vehicles(db)
    seed_routes(db)
