from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class VehicleBase(BaseModel):
    slug: str
    name: str
    capacity: int
    luggage: int
    rate_per_km: float
    base_fare: float
    driver_allowance: float
    night_charge: float
    description: Optional[str] = None
    image_url: Optional[str] = None
    features: Optional[str] = None


class VehicleOut(VehicleBase):
    id: int

    class Config:
        from_attributes = True


class GeocodeResult(BaseModel):
    display_name: str
    lat: float
    lon: float


class DistanceRequest(BaseModel):
    pickup: str
    drop: str


class DistanceResponse(BaseModel):
    pickup: GeocodeResult
    drop: GeocodeResult
    distance_km: float
    duration_min: float


class FareItem(BaseModel):
    vehicle: VehicleOut
    distance_km: float
    duration_min: float
    base_fare: float
    distance_fare: float
    driver_allowance: float
    total: float


class FareQuoteResponse(BaseModel):
    pickup: GeocodeResult
    drop: GeocodeResult
    distance_km: float
    duration_min: float
    trip_type: str
    quotes: List[FareItem]


class FareQuoteRequest(BaseModel):
    pickup: str
    drop: str
    trip_type: str = Field(default="oneway", pattern="^(oneway|roundtrip|local|airport)$")


class BookingCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    pickup: str
    drop: str
    pickup_datetime: datetime
    return_datetime: Optional[datetime] = None
    trip_type: str = Field(default="oneway", pattern="^(oneway|roundtrip|local|airport)$")
    vehicle_slug: str
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    reference: str
    name: str
    phone: str
    email: Optional[str]
    pickup: str
    drop_location: str
    pickup_datetime: datetime
    return_datetime: Optional[datetime]
    trip_type: str
    distance_km: float
    duration_min: float
    fare_estimate: float
    status: str
    notes: Optional[str]
    created_at: datetime
    vehicle: VehicleOut

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str = Field(min_length=2)


class ContactOut(BaseModel):
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    subject: Optional[str]
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class PopularRouteOut(BaseModel):
    id: int
    origin: str
    destination: str
    distance_km: float
    duration_hours: float
    sedan_price: float
    innova_price: float
    tempo_price: float
    image_url: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True
