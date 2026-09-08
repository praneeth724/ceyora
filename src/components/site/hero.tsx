"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface DestPreview {
  slug: string;
  name: string;
  tag: string | null;
  hero: string | null;
}

const SLIDES = [
  "/site/hero.jpg",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya_Rock.jpg?width=1800",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lanka_tea_plantation.jpg?width=1800",
  "https://commons.wikimedia.org/wiki/Special:FilePath/Mirissa_Beach.jpg?width=1800",
];

const STATS = [
  { value: "5K+", a: "Trips Planned", b: "Seamlessly" },
  { value: "60+", a: "Curated", b: "Destinations" },
  { value: "4.9", a: "Traveller", b: "Satisfaction" },
];

export function Hero({
  tagline,
  destinations,
}: {
  tagline: string | null;
  destinations: DestPreview[];
}) {
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(0);
  const previews = destinations.length ? destinations : [];

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
      setPreview((i) => (previews.length ? (i + 1) % previews.length : 0));
    }, 5000);
    return () => clearInterval(id);
  }, [previews.length]);

  const current = previews[preview];

  return (
    <section
      style={{ position: "relative", minHeight: 640, height: "92vh", maxHeight: 900, overflow: "hidden", background: "var(--bg)" }}
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === active ? 1 : 0,
            transition: "opacity 1.2s ease",
            animation: "kb 18s ease-out infinite alternate",
          }}
        />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,12,18,.5) 0%, rgba(2,12,18,.14) 30%, rgba(2,12,18,.1) 52%, rgba(2,12,18,.82) 100%)" }} />

      <div className="site-container" style={{ position: "relative", height: "92vh", minHeight: 640, maxHeight: 900, display: "flex", flexDirection: "column", padding: "104px 32px 56px" }}>
        <div style={{ textAlign: "center", maxWidth: 920, margin: "30px auto 0" }}>
          <h1 className="site-serif" style={{ fontWeight: 700, fontSize: "clamp(40px,7vw,82px)", lineHeight: 1.02, margin: 0, color: "#F2FAFF", textShadow: "0 4px 30px rgba(2,12,18,.55)" }}>
            A little island.<br />A world of wonders.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(242,250,255,.9)", maxWidth: 600, margin: "22px auto 30px", textShadow: "0 2px 14px rgba(2,12,18,.6)" }}>
            {tagline ? `${tagline} — explore breathtaking destinations, curated experiences and effortless travel.` : "Explore breathtaking destinations, curated experiences, and travel effortlessly across the island."}
          </p>
          <Link href="/packages" style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "8px 10px 8px 30px", background: "#F2FAFF", color: "#04202C", borderRadius: 4, fontSize: 13, fontWeight: 600, letterSpacing: ".06em" }}>
            Start Exploring
            <span style={{ width: 46, height: 46, borderRadius: "50%", background: "#0288D1", color: "#fff", display: "grid", placeItems: "center", fontSize: 18 }}>↗</span>
          </Link>
        </div>

        <div className="hero-bottom" style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", rowGap: 22 }}>
          <div className="hero-proof" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {STATS.map((s) => (
              <div key={s.value} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(2,12,18,.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(242,250,255,.14)", borderRadius: 4, padding: "13px 22px", width: "max-content" }}>
                <span className="site-serif" style={{ fontSize: 30, fontWeight: 700, color: "#F2FAFF", lineHeight: 1 }}>{s.value}</span>
                <span style={{ display: "flex", flexDirection: "column", fontSize: 12.5, lineHeight: 1.3, color: "rgba(242,250,255,.82)" }}>
                  <span>{s.a}</span><span>{s.b}</span>
                </span>
              </div>
            ))}
          </div>

          {current && (
            <div className="hero-preview" style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-end" }}>
              <span style={{ fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(242,250,255,.88)" }}>Most Visited</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button aria-label="Previous" onClick={() => setPreview((i) => (i - 1 + previews.length) % previews.length)} style={arrowStyle}>‹</button>
                <Link href={`/destinations/${current.slug}`} style={{ position: "relative", width: 220, height: 132, borderRadius: 4, overflow: "hidden", border: "1px solid rgba(242,250,255,.2)", display: "block" }}>
                  <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${current.hero || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,12,18,.9), transparent 62%)" }} />
                  <span className="site-serif" style={{ position: "absolute", left: 16, bottom: 26, fontSize: 18, color: "#F2FAFF" }}>{current.name}</span>
                  <span style={{ position: "absolute", left: 16, bottom: 11, fontSize: 11, letterSpacing: ".04em", color: "rgba(242,250,255,.72)" }}>{current.tag || "Sri Lanka"}</span>
                </Link>
                <button aria-label="Next" onClick={() => setPreview((i) => (i + 1) % previews.length)} style={arrowStyle}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const arrowStyle: React.CSSProperties = {
  flex: "0 0 auto",
  width: 38,
  height: 38,
  borderRadius: 4,
  border: "1px solid rgba(242,250,255,.4)",
  color: "#F2FAFF",
  display: "grid",
  placeItems: "center",
  background: "rgba(2,12,18,.35)",
  fontSize: 16,
  cursor: "pointer",
};
