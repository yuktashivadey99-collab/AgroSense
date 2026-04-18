import httpx
from fastapi import APIRouter, HTTPException, Request
from typing import Optional

router = APIRouter()

@router.get("/weather", summary="Get farm weather forecast")
async def get_farm_weather(
    lat: Optional[float] = None, 
    lon: Optional[float] = None,
    ip: Optional[str] = None,
    request: Request = None
):
    """
    Get current weather and forecast for the farm.
    If exact latitude and longitude are not provided, falls back to IP-based Geolocation (BigDataCloud/GeoJS).
    Uses the free Open-Meteo API.
    """
    # 1. Resolve Geolocation via GeoJS if coordinates are missing
    location_name = "Provided Coordinates"
    if lat is None or lon is None:
        client_ip = ip or (request.client.host if request and request.client else "")
        # Resolve localhost to public IP for testing
        if not client_ip or client_ip in ("127.0.0.1", "::1") or client_ip.startswith("192.168."):
            client_ip = "" 
            
        try:
            async with httpx.AsyncClient() as client:
                geo_url = f"https://get.geojs.io/v1/ip/geo/{client_ip}.json" if client_ip else "https://get.geojs.io/v1/ip/geo.json"
                geo_res = await client.get(geo_url)
                geo_res.raise_for_status()
                geo_data = geo_res.json()
                lat = float(geo_data.get("latitude"))
                lon = float(geo_data.get("longitude"))
                location_name = f"{geo_data.get('city', 'Unknown City')}, {geo_data.get('country', '')}".strip(', ')
        except Exception as e:
            raise HTTPException(status_code=400, detail="Could not seamlessly determine farm location. Please provide lat/lon.")

    # 2. Fetch Farm Weather from Open-Meteo
    try:
        async with httpx.AsyncClient() as client:
            weather_url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": lat,
                "longitude": lon,
                "current_weather": "true",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
                "timezone": "auto"
            }
            weather_res = await client.get(weather_url, params=params)
            weather_res.raise_for_status()
            weather_data = weather_res.json()
            
            # Map WMO weather codes to human readable conditions
            wmo_code = weather_data.get("current_weather", {}).get("weathercode", 0)
            condition = "Clear" if wmo_code <= 1 else "Cloudy" if wmo_code <= 3 else "Rain" if wmo_code <= 67 else "Snow/Storm"
            
            return {
                "success": True,
                "location": {
                    "name": location_name,
                    "latitude": lat,
                    "longitude": lon
                },
                "current": {
                    "temperature": weather_data.get("current_weather", {}).get("temperature"),
                    "windspeed": weather_data.get("current_weather", {}).get("windspeed"),
                    "condition": condition
                },
                "forecast": weather_data.get("daily", {})
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Weather forecasting service unavailable")
