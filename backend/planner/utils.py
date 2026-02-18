import requests

API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ1ZWJhMTY3NWY5MzRmYmJhMzg5MzUzNDczZTA1MTBiIiwiaCI6Im11cm11cjY0In0="

def get_route(start,end):

    url="https://api.openrouteservice.org/v2/directions/driving-car"

    body={
        "coordinates":[
            [start["lng"],start["lat"]],
            [end["lng"],end["lat"]]
        ]
    }

    headers={
        "Authorization":API_KEY,
        "Content-Type":"application/json"
    }

    r=requests.post(url,json=body,headers=headers).json()

    summary=r["routes"][0]["summary"]
    distance=summary["distance"]

    coords=r["routes"][0]["geometry"]["coordinates"]

    polyline=[
        [c[1],c[0]] for c in coords
    ]

    miles=distance*0.000621371

    return miles,polyline
