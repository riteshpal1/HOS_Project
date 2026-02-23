import requests
import polyline

API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ1ZWJhMTY3NWY5MzRmYmJhMzg5MzUzNDczZTA1MTBiIiwiaCI6Im11cm11cjY0In0="

CITY_COORDS = {
    "Delhi": [77.2090, 28.6139],
    "Mumbai": [72.8777, 19.0760],
    "Bangalore": [77.5946, 12.9716],
    "Chennai": [80.2707, 13.0827],
    "Hyderabad": [78.4867, 17.3850],
    "Kolkata": [88.3639, 22.5726]
}

def get_route(start_city, end_city):

    if start_city not in CITY_COORDS:
        raise Exception("Invalid start city")

    if end_city not in CITY_COORDS:
        raise Exception("Invalid end city")

    start = CITY_COORDS[start_city]
    end = CITY_COORDS[end_city]

    url = "https://api.openrouteservice.org/v2/directions/driving-car"

    headers = {
        "Authorization": API_KEY,
        "Content-Type": "application/json"
    }

    body = {
        "coordinates": [start, end]
    }

    response = requests.post(url, json=body, headers=headers)
    data = response.json()

    if "routes" not in data:
        raise Exception("Route API failed")

    distance_meters = data["routes"][0]["summary"]["distance"]
    geometry = data["routes"][0]["geometry"]

    decoded = polyline.decode(geometry)

    miles = distance_meters * 0.000621371

    return miles, decoded