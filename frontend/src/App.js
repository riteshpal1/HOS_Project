import axios from "axios";
import { useState } from "react";
import { MapContainer,TileLayer,Marker,Polyline } from "react-leaflet";

function App(){

  const [startLat,setStartLat]=useState("");
  const [startLng,setStartLng]=useState("");
  const [endLat,setEndLat]=useState("");
  const [endLng,setEndLng]=useState("");

  const [data,setData]=useState(null);

  const submit=async()=>{

    const res=await axios.post(
      "http://127.0.0.1:8000/api/plan-trip/",
      {
        start:{lat:parseFloat(startLat),lng:parseFloat(startLng)},
        end:{lat:parseFloat(endLat),lng:parseFloat(endLng)},
        cycle:10
      }
    );

    setData(res.data);
  };

  return(
    <div style={{padding:20,fontFamily:"Arial"}}>

      <h1>🚛 HOS Planner FINAL</h1>

      <h3>Start Location</h3>
      <input placeholder="Lat" onChange={e=>setStartLat(e.target.value)}/>
      <input placeholder="Lng" onChange={e=>setStartLng(e.target.value)}/>

      <h3>End Location</h3>
      <input placeholder="Lat" onChange={e=>setEndLat(e.target.value)}/>
      <input placeholder="Lng" onChange={e=>setEndLng(e.target.value)}/>

      <br/><br/>

      <button onClick={submit}>Plan Trip</button>

      {data && (
        <>
        <MapContainer center={[23,80]} zoom={5}
                      style={{height:400}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <Polyline positions={data.polyline}/>
        </MapContainer>

        <h2>Total Miles: {data.total_miles}</h2>

        {data.logs.map(l=>(
          <div key={l.day}>
            <h3>Day {l.day}</h3>
            <p>Driving: {l.driving_hours}</p>
            <p>Fuel: {l.fuel_stop?"Yes":"No"}</p>
          </div>
        ))}
        </>
      )}

    </div>
  );
}

export default App;
