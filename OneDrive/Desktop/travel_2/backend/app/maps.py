"""Free map APIs: Nominatim for geocoding, OSRM for routing."""

from typing import Optional, Tuple

import httpx

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OSRM_URL = "https://router.project-osrm.org/route/v1/driving"
USER_AGENT = "MehraTourAndTravel/1.0 (bookings@mehratours.example)"


async def geocode(query: str) -> Optional[dict]:
    """Resolve a place name to lat/lon using Nominatim. Bhopal-biased."""
    if not query or not query.strip():
        return None

    params = {
        "q": query.strip(),
        "format": "json",
        "limit": 1,
        "countrycodes": "in",
        "addressdetails": 0,
    }
    headers = {"User-Agent": USER_AGENT}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(NOMINATIM_URL, params=params, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    if not data:
        return None

    first = data[0]
    return {
        "display_name": first.get("display_name", query),
        "lat": float(first["lat"]),
        "lon": float(first["lon"]),
    }


async def route_distance(
    pickup: Tuple[float, float], drop: Tuple[float, float]
) -> Optional[dict]:
    """Return distance (km) and duration (min) for driving route via OSRM."""
    plat, plon = pickup
    dlat, dlon = drop
    url = f"{OSRM_URL}/{plon},{plat};{dlon},{dlat}"
    params = {"overview": "false", "alternatives": "false", "steps": "false"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        return None

    route = data["routes"][0]
    return {
        "distance_km": round(route["distance"] / 1000.0, 2),
        "duration_min": round(route["duration"] / 60.0, 1),
    }


async def resolve_and_route(pickup: str, drop: str) -> Optional[dict]:
    p = await geocode(pickup)
    d = await geocode(drop)
    if not p or not d:
        return None
    r = await route_distance((p["lat"], p["lon"]), (d["lat"], d["lon"]))
    if not r:
        return None
    return {
        "pickup": p,
        "drop": d,
        "distance_km": r["distance_km"],
        "duration_min": r["duration_min"],
    }
