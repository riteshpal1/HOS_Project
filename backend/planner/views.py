from rest_framework.decorators import api_view
from rest_framework.response import Response
from .utils import get_route
from .hos import generate_eld_logs

@api_view(["POST"])
def plan_trip(request):

    try:
        current = request.data.get("current_location")
        pickup = request.data.get("pickup_location")
        dropoff = request.data.get("dropoff_location")
        cycle = float(request.data.get("cycle_used"))

        miles1, route1 = get_route(current, pickup)
        miles2, route2 = get_route(pickup, dropoff)

        total_miles = miles1 + miles2
        full_route = route1 + route2

        logs, fuel_stops = generate_eld_logs(total_miles, cycle)

        return Response({
            "total_miles": round(total_miles,2),
            "fuel_stops": fuel_stops,
            "logs": logs,
            "route": full_route
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)