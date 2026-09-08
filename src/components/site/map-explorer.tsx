"use client";

import Link from "next/link";
import { useState } from "react";

export interface MapDest {
  slug: string;
  name: string;
  tag: string | null;
  description: string;
  shortDesc: string | null;
  hero: string | null;
  gallery: string[];
  pinTop: string | null;
  pinLeft: string | null;
}

// Fallback pin spread across the island silhouette when a destination has no coords.
const FALLBACK = [
  { top: "22%", left: "50%" },
  { top: "38%", left: "62%" },
  { top: "44%", left: "40%" },
  { top: "56%", left: "66%" },
  { top: "62%", left: "34%" },
  { top: "74%", left: "52%" },
  { top: "82%", left: "42%" },
  { top: "50%", left: "72%" },
];

export function MapExplorer({ destinations }: { destinations: MapDest[] }) {
  const [selected, setSelected] = useState(0);
  if (destinations.length === 0) return null;
  const sel = destinations[selected];

  return (
    <div className="grid-2" style={{ gap: 56, alignItems: "center" }}>
      {/* Map with pins */}
      <div style={{ position: "relative", width: "100%", maxWidth: 430, justifySelf: "center" }}>
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mapimg-dark" src="/site/map-dark.webp" alt="Map of Sri Lanka" style={{ width: "100%", display: "block" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mapimg-light" src="/site/map-light.webp" alt="Map of Sri Lanka" style={{ width: "100%", display: "block", position: "absolute", inset: 0 }} />
          {destinations.map((d, i) => {
            const top = d.pinTop || FALLBACK[i % FALLBACK.length].top;
            const left = d.pinLeft || FALLBACK[i % FALLBACK.length].left;
            const isSel = i === selected;
            return (
              <button
                key={d.slug}
                onClick={() => setSelected(i)}
                aria-label={d.name}
                style={{ position: "absolute", top, left, transform: "translate(-50%,-100%)", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
              >
                <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
                  <span style={{ position: "absolute", width: 26, height: 26, borderRadius: "50%", background: isSel ? "rgba(2,136,209,.5)" : "rgba(2,136,209,.3)", animation: "pulse 3s ease-in-out infinite" }} />
                  <span style={{ position: "relative", width: 14, height: 14, borderRadius: "50%", background: isSel ? "#4FC3F7" : "#0288D1", border: "2px solid #fff" }} />
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 14 }}>
          {destinations.map((d, i) => (
            <button
              key={d.slug}
              onClick={() => setSelected(i)}
              style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 10.5, letterSpacing: ".04em", cursor: "pointer",
                background: i === selected ? "#0288D1" : "rgba(4,30,40,.5)",
                color: i === selected ? "#fff" : "var(--txt-mid)",
                border: "1px solid " + (i === selected ? "#0288D1" : "var(--bd-soft)"),
              }}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected panel */}
      <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(2,136,209,.28)", background: "var(--panel-2)", backdropFilter: "blur(8px)" }}>
        <div style={{ position: "relative", height: 290, overflow: "hidden" }}>
          <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${sel.hero || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.92) 4%, rgba(4,30,40,.05) 60%)" }} />
          {sel.tag && (
            <span style={{ position: "absolute", top: 18, left: 18, padding: "7px 15px", borderRadius: 8, background: "#0288D1", color: "#fff", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase" }}>{sel.tag}</span>
          )}
          <span className="site-serif" style={{ position: "absolute", left: 24, bottom: 16, fontSize: 44, lineHeight: 1, color: "#F2FAFF" }}>{sel.name}</span>
        </div>
        <div style={{ padding: "26px 28px 28px" }}>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--txt)", margin: "0 0 20px" }}>
            {sel.shortDesc || sel.description}
          </p>
          {sel.gallery.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
              {sel.gallery.slice(0, 3).map((img, i) => (
                <span key={i} style={{ display: "block", height: 120, borderRadius: 12, backgroundImage: `url('${img}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href={`/destinations/${sel.slug}`} className="btn-primary">Explore →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
