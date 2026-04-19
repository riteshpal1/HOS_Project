import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

// FIX Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function App() {

  const [form, setForm] = useState({
    current: "",
    pickup: "",
    dropoff: "",
    cycle: ""
  });

  const [result, setResult] = useState(null);

  const cities = [
    "Delhi","Mumbai","Bangalore","Chennai","Hyderabad",
    "Kolkata","Ahmedabad","Pune","Jaipur","Lucknow","Chandigarh"
  ];

  const submit = async () => {
    if (!form.current || !form.pickup || !form.dropoff || !form.cycle) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "https://hos-project.onrender.com/api/plan-trip/",
        {
          current_location: form.current,
          pickup_location: form.pickup,
          dropoff_location: form.dropoff,
          cycle_used: form.cycle
        }
      );
      setResult(res.data);
    } catch {
      alert("Backend Error. Make sure Render backend is awake.");
    }
  };

  // ================= ELD GRID =================
  const ELDGrid = ({ log }) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="card shadow p-3 mb-3">
        <h5>Day {log.day}</h5>

        <div className="eld-grid">

          <div></div>
          {hours.map(h => (
            <div key={h} className="hour-label">{h}</div>
          ))}

          <div className="row-label">Off</div>
          {hours.map(h => (
            <div key={h}
              className="grid-cell"
              style={{ backgroundColor: h >= log.on_duty_hours ? "#d1fae5" : "white" }}
            />
          ))}

          <div className="row-label">Drive</div>
          {hours.map(h => (
            <div key={h}
              className="grid-cell"
              style={{ backgroundColor: h < log.driving_hours ? "#fecaca" : "white" }}
            />
          ))}

          <div className="row-label">On Duty</div>
          {hours.map(h => (
            <div key={h}
              className="grid-cell"
              style={{
                backgroundColor:
                  h < log.on_duty_hours && h >= log.driving_hours
                    ? "#bfdbfe"
                    : "white"
              }}
            />
          ))}

        </div>

        <div className="mt-2">
          Driving: {log.driving_hours}h | On Duty: {log.on_duty_hours}h | Off: {log.off_duty_hours}h
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4">

      {/* HEADER */}
      <h2 className="text-center mb-4 fw-bold">
        🚛 HOS Compliance Planner
      </h2>

      <div className="row g-4">

        {/* LEFT PANEL */}
        <div className="col-md-4">
          <div className="card shadow p-3">

            <h5 className="mb-3">Trip Details</h5>

            <select
              className="form-select mb-3"
              value={form.current}
              onChange={e => setForm({ ...form, current: e.target.value })}
            >
              <option value="">Current City</option>
              {cities.map(city => <option key={city}>{city}</option>)}
            </select>

            <select
              className="form-select mb-3"
              value={form.pickup}
              onChange={e => setForm({ ...form, pickup: e.target.value })}
            >
              <option value="">Pickup City</option>
              {cities.map(city => <option key={city}>{city}</option>)}
            </select>

            <select
              className="form-select mb-3"
              value={form.dropoff}
              onChange={e => setForm({ ...form, dropoff: e.target.value })}
            >
              <option value="">Dropoff City</option>
              {cities.map(city => <option key={city}>{city}</option>)}
            </select>

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Cycle Used (hrs)"
              value={form.cycle}
              onChange={e => setForm({ ...form, cycle: e.target.value })}
            />

            <button className="btn btn-primary w-100" onClick={submit}>
              Plan Trip
            </button>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-8">
          <div className="card shadow p-3">

            {result ? (
              <>
                {/* STATS */}
                <div className="row text-center mb-3">
                  <div className="col">
                    <div className="bg-light p-2 rounded">
                      <small>Total Miles</small>
                      <h5>{result.total_miles}</h5>
                    </div>
                  </div>
                  <div className="col">
                    <div className="bg-light p-2 rounded">
                      <small>Fuel Stops</small>
                      <h5>{result.fuel_stops}</h5>
                    </div>
                  </div>
                </div>

                <MapContainer
                  center={result.route?.[0] || [28.61, 77.20]}
                  zoom={6}
                  style={{ height: "350px", borderRadius: "10px" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline positions={result.route} />
                </MapContainer>
              </>
            ) : (
              <p className="text-center text-muted mt-5">
                Plan a trip to see route and stats
              </p>
            )}

          </div>
        </div>

      </div>

      {/* LOGS */}
      {result && (
        <div className="mt-4">
          <h4>Daily Log Sheets</h4>
          {result.logs.map(log => (
            <ELDGrid key={log.day} log={log} />
          ))}
        </div>
      )}

    </div>
  );
}

export default App;