"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "./theme";

export interface DestItem {
  slug: string;
  name: string;
  tag: string | null;
  shortDesc: string | null;
  hero: string | null;
  pinTop: string | null;
  pinLeft: string | null;
}

const FALLBACK = [
  { top: "22%", left: "50%" }, { top: "38%", left: "62%" }, { top: "44%", left: "40%" },
  { top: "56%", left: "66%" }, { top: "62%", left: "34%" }, { top: "74%", left: "52%" },
  { top: "82%", left: "42%" }, { top: "50%", left: "72%" }, { top: "30%", left: "44%" },
  { top: "68%", left: "60%" }, { top: "90%", left: "40%" }, { top: "86%", left: "58%" },
  { top: "76%", left: "72%" }, { top: "84%", left: "36%" },
];

export function DestinationsExplorer({ destinations }: { destinations: DestItem[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    destinations.forEach((d) => d.tag && set.add(d.tag));
    return ["All", ...Array.from(set)];
  }, [destinations]);
  const [filter, setFilter] = useState("All");
  const [hover, setHover] = useState<number | null>(null);
  const { theme } = useTheme();
  const mapSrc = theme === "light" ? "/site/map-light.webp" : "/site/map-dark.webp";

  const shown = filter === "All" ? destinations : destinations.filter((d) => d.tag === filter);

  return (
    <>
      {/* Hero: copy + filters | map */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(900px 520px at 50% -10%, rgba(1,87,155,.5), transparent 70%)" }} />
        <div className="site-container grid-2" style={{ position: "relative", paddingTop: 120, paddingBottom: 60, gap: 48, alignItems: "center" }}>
          <div>
            <div className="site-eyebrow" style={{ marginBottom: 14 }}>Explore Sri Lanka</div>
            <h1 className="site-serif" style={{ fontSize: "clamp(38px,5.5vw,58px)", lineHeight: 1.02, margin: "0 0 18px", fontWeight: 500, color: "var(--head)" }}>
              Find your kind<br />of <em>somewhere.</em>
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--txt)", maxWidth: 420, margin: "0 0 28px" }}>
              Follow the coast, head for the hills, or take the road less travelled. Choose a mood, explore the map, and find a place that feels like you.
            </p>
            <div style={{ width: 52, height: 1, background: "var(--gold)", marginBottom: 28 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    padding: "11px 17px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                    background: filter === t ? "rgba(2,136,209,.14)" : "transparent",
                    border: "1px solid " + (filter === t ? "rgba(2,136,209,.5)" : "var(--bd-soft)"),
                    color: filter === t ? "var(--gold-l)" : "var(--txt)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", justifySelf: "center", width: "100%", maxWidth: 430 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mapSrc} alt="Map of Sri Lanka" style={{ width: "100%", display: "block" }} />
            {destinations.map((d, i) => {
              const top = d.pinTop || FALLBACK[i % FALLBACK.length].top;
              const left = d.pinLeft || FALLBACK[i % FALLBACK.length].left;
              const on = hover === i;
              return (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{ position: "absolute", top, left, transform: "translate(-50%,-50%)" }}
                  aria-label={d.name}
                >
                  <span style={{ position: "relative", display: "grid", placeItems: "center", zIndex: on ? 5 : 1 }}>
                    <span style={{ position: "absolute", width: 26, height: 26, borderRadius: "50%", background: on ? "rgba(2,136,209,.4)" : "rgba(2,136,209,.16)", animation: "pulse 3s ease-in-out infinite" }} />
                    <span style={{ position: "relative", width: 12, height: 12, borderRadius: "50%", background: on ? "#81D4FA" : "#0288D1", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(2,12,18,.5)" }} />
                  </span>
                  <span
                    style={{
                      position: "absolute", left: "50%", top: -8, transform: "translate(-50%,-100%)",
                      whiteSpace: "nowrap", fontSize: 10, fontWeight: 500, letterSpacing: ".02em",
                      padding: "3px 8px", borderRadius: 6,
                      background: on ? "#0288D1" : "rgba(4,30,40,.82)", color: "#fff",
                      border: "1px solid rgba(2,136,209,.55)", boxShadow: "0 2px 6px rgba(2,12,18,.45)",
                      pointerEvents: "none", zIndex: on ? 6 : 2,
                    }}
                  >
                    {d.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* List */}
      <section className="site-container" style={{ padding: "0 0 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 className="site-serif" style={{ fontSize: 34, margin: 0, fontWeight: 500, color: "var(--head)" }}>{filter === "All" ? "All Destinations" : filter}</h2>
          <span style={{ fontSize: 12.5, color: "var(--txt-faint)" }}>{shown.length} places</span>
        </div>
        <div className="grid-3" style={{ gap: 16 }}>
          {shown.map((d) => (
            <Link key={d.slug} href={`/destinations/${d.slug}`} style={{ display: "flex", overflow: "hidden", borderRadius: 20, background: "var(--panel)", border: "1px solid var(--bd-soft)", flexDirection: "column", transition: "transform .3s, box-shadow .3s" }} className="site-card">
              <span style={{ width: "100%", height: 200, backgroundImage: `url('${d.hero || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center", display: "block" }} />
              <span style={{ padding: 24, display: "flex", flexDirection: "column", gap: 6 }}>
                {d.tag && <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-l)" }}>{d.tag}</span>}
                <span className="site-serif" style={{ fontSize: 27, color: "var(--head)" }}>{d.name}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--txt-mid)" }}>{d.shortDesc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
