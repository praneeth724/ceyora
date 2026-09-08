"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#0288D1;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

function Recenter({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) map.setView([lat, lng], 11);
  }, [lat, lng, map]);
  return null;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function LocationPicker({
  lat,
  lng,
  onChange,
  height = 300,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number, name?: string) => void;
  height?: number;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!q || q.length < 3) { setResults([]); return; }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=lk&q=${encodeURIComponent(q)}`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = (await res.json()) as NominatimResult[];
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  function pick(r: NominatimResult) {
    const name = r.display_name.split(",")[0];
    onChange(parseFloat(r.lat), parseFloat(r.lon), name);
    setQ(name);
    setOpen(false);
    setResults([]);
  }

  const center: [number, number] = lat != null && lng != null ? [lat, lng] : [7.8731, 80.7718];

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="Search a place in Sri Lanka (e.g. Sigiriya)…"
            className="pl-9"
          />
          {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
        </div>
        {open && results.length > 0 && (
          <ul className="absolute z-[1000] mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white shadow-lg dark:bg-slate-900">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => pick(r)}
                  className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ height, borderRadius: 12, overflow: "hidden", border: "1px solid var(--border, #e2e8f0)" }}>
        <MapContainer center={center} zoom={lat != null ? 11 : 7} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={(la, ln) => onChange(la, ln)} />
          {lat != null && lng != null && <Marker position={[lat, lng]} icon={pinIcon} />}
          <Recenter lat={lat} lng={lng} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500">
        Search a place or click the map to drop a pin.
        {lat != null && lng != null ? ` Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}` : " No location set."}
      </p>
    </div>
  );
}
