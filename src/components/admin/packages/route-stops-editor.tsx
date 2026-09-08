"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface RouteStop {
  name: string;
  lat: number | null;
  lng: number | null;
  note?: string;
}

interface NominatimResult { display_name: string; lat: string; lon: string }

export function RouteStopsEditor({
  value,
  onChange,
}: {
  value: RouteStop[];
  onChange: (next: RouteStop[]) => void;
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
        setResults((await res.json()) as NominatimResult[]);
        setOpen(true);
      } catch { setResults([]); } finally { setLoading(false); }
    }, 450);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  function addFromSearch(r: NominatimResult) {
    onChange([...value, { name: r.display_name.split(",")[0], lat: parseFloat(r.lat), lng: parseFloat(r.lon), note: "" }]);
    setQ(""); setResults([]); setOpen(false);
  }
  function addBlank() { onChange([...value, { name: "", lat: null, lng: null, note: "" }]); }
  function update(i: number, patch: Partial<RouteStop>) {
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i: number) { onChange(value.filter((_, idx) => idx !== i)); }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => results.length && setOpen(true)} placeholder="Search a place to add as a stop (e.g. Kandy)…" className="pl-9" />
          {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />}
        </div>
        {open && results.length > 0 && (
          <ul className="absolute z-[1000] mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white shadow-lg dark:bg-slate-900">
            {results.map((r, i) => (
              <li key={i}>
                <button type="button" onClick={() => addFromSearch(r)} className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">{r.display_name}</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {value.map((s, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs text-white">{i + 1}</span>
            <Input value={s.name} placeholder="Location name" onChange={(e) => update(i, { name: e.target.value })} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 pl-8">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Latitude</Label>
              <Input type="number" step="any" value={s.lat ?? ""} placeholder="6.9344" onChange={(e) => update(i, { lat: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Longitude</Label>
              <Input type="number" step="any" value={s.lng ?? ""} placeholder="79.8501" onChange={(e) => update(i, { lng: e.target.value === "" ? null : Number(e.target.value) })} />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addBlank}><Plus className="mr-1 h-4 w-4" /> Add stop manually</Button>
    </div>
  );
}
