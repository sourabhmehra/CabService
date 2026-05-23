"""Fare calculation based on distance, vehicle class, trip type."""

from typing import List

from . import models


def compute_fare(
    vehicle: models.Vehicle,
    distance_km: float,
    trip_type: str = "oneway",
) -> dict:
    """Return fare breakdown for one vehicle."""
    effective_distance = distance_km
    if trip_type == "roundtrip":
        effective_distance = distance_km * 2

    # Round-trip / outstation has a daily minimum of 250 km equivalent fare?
    # Keeping it simple here.
    distance_fare = round(effective_distance * vehicle.rate_per_km, 2)
    base = vehicle.base_fare
    driver = vehicle.driver_allowance if trip_type in ("roundtrip", "oneway") else 0.0

    total = round(base + distance_fare + driver, 2)
    return {
        "vehicle": vehicle,
        "distance_km": round(effective_distance, 2),
        "duration_min": 0.0,  # set by caller
        "base_fare": base,
        "distance_fare": distance_fare,
        "driver_allowance": driver,
        "total": total,
    }


def compute_quotes(
    vehicles: List[models.Vehicle],
    distance_km: float,
    duration_min: float,
    trip_type: str = "oneway",
) -> List[dict]:
    out = []
    for v in vehicles:
        q = compute_fare(v, distance_km, trip_type)
        q["duration_min"] = duration_min
        out.append(q)
    return out
