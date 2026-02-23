import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function App() {

  const [form, setForm] = useState({
    current: "",
    pickup: "",
    dropoff: "",
    cycle: ""
  });

  const [result, setResult] = useState(null);

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata"
  ];

  const submit = async () => {
    try {
      const res = await axios.post("https://hos-project.onrender.com/api/plan-trip/",
        {
          current_location: form.current,
          pickup_location: form.pickup,
          dropoff_location: form.dropoff,
          cycle_used: form.cycle
        }
      );

      setResult(res.data);
    } catch (err) {
      alert("Backend Error. Check Django terminal.");
    }
  };

  // =======================
  // ELD GRID COMPONENT
  // =======================

  const ELDGrid = ({ log }) => {

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div style={{
        border: "2px solid black",
        margin: "20px 0",
        padding: "10px"
      }}>
        <h3>Day {log.day}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(24, 1fr)" }}>

          {/* Header Row */}
          <div></div>
          {hours.map(h => (
            <div key={h} style={{
              border: "1px solid #ccc",
              fontSize: 10,
              textAlign: "center"
            }}>
              {h}
            </div>
          ))}

          {/* Off Duty */}
          <div style={{ border: "1px solid black" }}>Off Duty</div>
          {hours.map(h => (
            <div key={h} style={{
              border: "1px solid #ddd",
              backgroundColor: h >= log.on_duty_hours ? "#c8f7c5" : "white"
            }} />
          ))}

          {/* Driving */}
          <div style={{ border: "1px solid black" }}>Driving</div>
          {hours.map(h => (
            <div key={h} style={{
              border: "1px solid #ddd",
              backgroundColor: h < log.driving_hours ? "#ff7675" : "white"
            }} />
          ))}

          {/* On Duty (Not Driving) */}
          <div style={{ border: "1px solid black" }}>On Duty</div>
          {hours.map(h => (
            <div key={h} style={{
              border: "1px solid #ddd",
              backgroundColor:
                h < log.on_duty_hours && h >= log.driving_hours
                  ? "#74b9ff"
                  : "white"
            }} />
          ))}

        </div>

        <div style={{ marginTop: 10 }}>
          Driving: {log.driving_hours} hrs |
          On Duty: {log.on_duty_hours} hrs |
          Off Duty: {log.off_duty_hours} hrs
        </div>

      </div>
    );
  };

  // =======================

  return (
    <div style={{ padding: 20 }}>

      <h1>HOS Compliance Planner</h1>

      <div style={{ marginBottom: 20 }}>

        <select onChange={e => setForm({ ...form, current: e.target.value })}>
          <option>Select Current City</option>
          {cities.map(city => <option key={city}>{city}</option>)}
        </select>

        <br /><br />

        <select onChange={e => setForm({ ...form, pickup: e.target.value })}>
          <option>Select Pickup City</option>
          {cities.map(city => <option key={city}>{city}</option>)}
        </select>

        <br /><br />

        <select onChange={e => setForm({ ...form, dropoff: e.target.value })}>
          <option>Select Dropoff City</option>
          {cities.map(city => <option key={city}>{city}</option>)}
        </select>

        <br /><br />

        <input
          placeholder="Current Cycle Used (hrs)"
          onChange={e => setForm({ ...form, cycle: e.target.value })}
        />

        <br /><br />

        <button onClick={submit}>Plan Trip</button>
      </div>

      {result && (
        <>
          <h2>Total Miles: {result.total_miles}</h2>
          <h3>Fuel Stops: {result.fuel_stops}</h3>

          {/* MAP */}
          <MapContainer
            center={result.route[0]}
            zoom={6}
            style={{ height: 400, marginBottom: 20 }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={result.route} />
          </MapContainer>

          {/* LOG SHEETS */}
          <h2>Daily Log Sheets</h2>

          {result.logs.map(log => (
            <ELDGrid key={log.day} log={log} />
          ))}
        </>
      )}

    </div>
  );
}

export default App;