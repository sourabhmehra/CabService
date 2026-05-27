import secrets
import string
from datetime import datetime
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import maps, models, pricing, schemas
from .database import Base, SessionLocal, engine, get_db
from .seed import run_seed

Base.metadata.create_all(bind=engine)

# Seed initial data
_seed_db = SessionLocal()
try:
    run_seed(_seed_db)
finally:
    _seed_db.close()


app = FastAPI(
    title="Mehra Tour and Travel API",
    description="Booking, fares and routes for Mehra Tour and Travel, Bhopal.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _gen_reference() -> str:
    alphabet = string.ascii_uppercase + string.digits
    code = "".join(secrets.choice(alphabet) for _ in range(8))
    return f"MTT-{code}"


@app.get("/")
def root():
    return {
        "agency": "Mehra Tour and Travel",
        "city": "Bhopal",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/api/vehicles", response_model=List[schemas.VehicleOut])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(models.Vehicle).order_by(models.Vehicle.rate_per_km).all()


@app.get("/api/vehicles/{slug}", response_model=schemas.VehicleOut)
def get_vehicle(slug: str, db: Session = Depends(get_db)):
    v = db.query(models.Vehicle).filter(models.Vehicle.slug == slug).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v


@app.get("/api/routes", response_model=List[schemas.PopularRouteOut])
def list_routes(db: Session = Depends(get_db)):
    return db.query(models.PopularRoute).order_by(models.PopularRoute.distance_km).all()


@app.post("/api/distance", response_model=schemas.DistanceResponse)
async def calculate_distance(payload: schemas.DistanceRequest):
    result = await maps.resolve_and_route(payload.pickup, payload.drop)
    if not result:
        raise HTTPException(
            status_code=400,
            detail="Could not resolve one or both locations. Please be more specific (add city/state).",
        )
    return result


@app.post("/api/quote", response_model=schemas.FareQuoteResponse)
async def fare_quote(payload: schemas.FareQuoteRequest, db: Session = Depends(get_db)):
    result = await maps.resolve_and_route(payload.pickup, payload.drop)
    if not result:
        raise HTTPException(
            status_code=400,
            detail="Could not resolve one or both locations. Please be more specific (add city/state).",
        )

    vehicles = db.query(models.Vehicle).order_by(models.Vehicle.rate_per_km).all()
    quotes = pricing.compute_quotes(
        vehicles,
        distance_km=result["distance_km"],
        duration_min=result["duration_min"],
        trip_type=payload.trip_type,
    )

    return {
        "pickup": result["pickup"],
        "drop": result["drop"],
        "distance_km": result["distance_km"],
        "duration_min": result["duration_min"],
        "trip_type": payload.trip_type,
        "quotes": quotes,
    }


@app.post("/api/bookings", response_model=schemas.BookingOut, status_code=status.HTTP_201_CREATED)
async def create_booking(payload: schemas.BookingCreate, db: Session = Depends(get_db)):
    vehicle = (
        db.query(models.Vehicle)
        .filter(models.Vehicle.slug == payload.vehicle_slug)
        .first()
    )
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not available")

    route = await maps.resolve_and_route(payload.pickup, payload.drop)
    if not route:
        raise HTTPException(
            status_code=400,
            detail="Could not resolve pickup/drop locations.",
        )

    fare = pricing.compute_fare(
        vehicle,
        distance_km=route["distance_km"],
        trip_type=payload.trip_type,
    )

    booking = models.Booking(
        reference=_gen_reference(),
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        email=payload.email,
        pickup=route["pickup"]["display_name"],
        drop_location=route["drop"]["display_name"],
        pickup_lat=route["pickup"]["lat"],
        pickup_lon=route["pickup"]["lon"],
        drop_lat=route["drop"]["lat"],
        drop_lon=route["drop"]["lon"],
        pickup_datetime=payload.pickup_datetime,
        return_datetime=payload.return_datetime,
        trip_type=payload.trip_type,
        distance_km=route["distance_km"],
        duration_min=route["duration_min"],
        fare_estimate=fare["total"],
        status="pending",
        notes=payload.notes,
        vehicle_id=vehicle.id,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@app.get("/api/bookings/{reference}", response_model=schemas.BookingOut)
def get_booking(reference: str, db: Session = Depends(get_db)):
    b = db.query(models.Booking).filter(models.Booking.reference == reference).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b


@app.get("/api/bookings", response_model=List[schemas.BookingOut])
def list_bookings(db: Session = Depends(get_db)):
    return (
        db.query(models.Booking)
        .order_by(models.Booking.created_at.desc())
        .limit(100)
        .all()
    )


@app.post("/api/reviews", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(payload: schemas.ReviewCreate, db: Session = Depends(get_db)):
    review = models.Review(
        customer_name=payload.customer_name.strip(),
        trip_description=payload.trip_description.strip() if payload.trip_description else None,
        rating=payload.rating,
        comment=payload.comment.strip(),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@app.get("/api/reviews", response_model=List[schemas.ReviewOut])
def list_reviews(db: Session = Depends(get_db)):
    return (
        db.query(models.Review)
        .filter(models.Review.is_approved == True)
        .order_by(models.Review.created_at.desc())
        .limit(50)
        .all()
    )


@app.post("/api/contact", response_model=schemas.ContactOut, status_code=status.HTTP_201_CREATED)
def create_contact(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    msg = models.ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        phone=payload.phone,
        subject=payload.subject,
        message=payload.message.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
