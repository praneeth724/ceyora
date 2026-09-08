"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
  note?: string;
}

function numberedIcon(n: number) {
  return L.divIcon({
    className: "",
    html: `<div style="width:30px;height:30px;border-radius:50%;background:#0288D1;color:#fff;display:flex;align-items:center;justify-content:center;font:600 13px sans-serif;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], 9);
    } else if (points.length > 1) {
      map.fitBounds(points as L.LatLngBoundsLiteral, { padding: [40, 40] });
    }
  }, [map, points]);
  return null;
}

export default function RouteMap({ stops }: { stops: RouteStop[] }) {
  const valid = stops.filter((s) => typeof s.lat === "number" && typeof s.lng === "number");
  const points = valid.map((s) => [s.lat, s.lng] as [number, number]);
  const center: [number, number] = points[0] ?? [7.8731, 80.7718]; // Sri Lanka

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: 480, width: "100%", borderRadius: 16, zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.length > 1 && (
        <Polyline positions={points} pathOptions={{ color: "#0288D1", weight: 3, dashArray: "6 8" }} />
      )}
      {valid.map((s, i) => (
        <Marker key={i} position={[s.lat, s.lng]} icon={numberedIcon(i + 1)}>
          <Popup>
            <strong>{s.name}</strong>
            {s.note ? <div>{s.note}</div> : null}
          </Popup>
        </Marker>
      ))}
      <FitBounds points={points} />
    </MapContainer>
  );
}
