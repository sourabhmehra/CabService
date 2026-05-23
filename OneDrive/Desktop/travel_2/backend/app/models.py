from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    luggage = Column(Integer, nullable=False, default=2)
    rate_per_km = Column(Float, nullable=False)
    base_fare = Column(Float, nullable=False, default=200.0)
    driver_allowance = Column(Float, nullable=False, default=300.0)
    night_charge = Column(Float, nullable=False, default=250.0)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    features = Column(Text, nullable=True)  # comma-separated

    bookings = relationship("Booking", back_populates="vehicle")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(120), nullable=True)
    pickup = Column(String(255), nullable=False)
    drop_location = Column(String(255), nullable=False)
    pickup_lat = Column(Float, nullable=True)
    pickup_lon = Column(Float, nullable=True)
    drop_lat = Column(Float, nullable=True)
    drop_lon = Column(Float, nullable=True)
    pickup_datetime = Column(DateTime, nullable=False)
    return_datetime = Column(DateTime, nullable=True)
    trip_type = Column(String(20), nullable=False, default="oneway")  # oneway | roundtrip | local | airport
    distance_km = Column(Float, nullable=False, default=0.0)
    duration_min = Column(Float, nullable=False, default=0.0)
    fare_estimate = Column(Float, nullable=False, default=0.0)
    status = Column(String(20), nullable=False, default="pending")  # pending | confirmed | completed | cancelled
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    vehicle = relationship("Vehicle", back_populates="bookings")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), nullable=True)
    phone = Column(String(20), nullable=True)
    subject = Column(String(200), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class PopularRoute(Base):
    __tablename__ = "popular_routes"

    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String(120), nullable=False)
    destination = Column(String(120), nullable=False)
    distance_km = Column(Float, nullable=False)
    duration_hours = Column(Float, nullable=False)
    sedan_price = Column(Float, nullable=False)
    innova_price = Column(Float, nullable=False)
    tempo_price = Column(Float, nullable=False)
    image_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
