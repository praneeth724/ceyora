"use client";

import { useEffect, useRef } from "react";

export interface JourneyStep {
  day?: number;
  title: string;
  description: string;
  image?: string;
}

export function DayTimeline({ steps, totalDays }: { steps: JourneyStep[]; totalDays: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".tl-item"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      items.forEach((i) => i.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((i) => obs.observe(i));
    // safety net
    const t = window.setTimeout(() => items.forEach((i) => i.classList.add("in")), 1400);
    return () => {
      obs.disconnect();
      window.clearTimeout(t);
    };
  }, [steps]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 30 }}>
        <h2 className="site-serif" style={{ fontSize: 34, margin: 0, fontWeight: 500, color: "var(--head)" }}>Day by Day</h2>
        <span style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{totalDays} days</span>
      </div>
      <div className="tl" ref={ref}>
        {steps.map((d, i) => (
          <div className="tl-item" key={i} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
            <div className="tl-rail">
              <span className="tl-node">
                <span className="tl-node-label">Day</span>
                <span className="tl-node-num site-serif">{d.day ?? i + 1}</span>
              </span>
            </div>
            <div className="tl-card">
              {d.image && (
                <div className="tl-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.image} alt={d.title} loading="lazy" />
                </div>
              )}
              <div className="tl-body">
                <h3 className="site-serif">{d.title}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{d.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
