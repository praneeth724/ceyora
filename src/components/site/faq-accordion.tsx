"use client";

import { useState } from "react";

export interface FaqItem { q: string; a: string }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ border: "1px solid " + (isOpen ? "rgba(2,136,209,.45)" : "var(--bd-soft)"), borderRadius: 14, background: "var(--panel)", overflow: "hidden", transition: "border-color .35s ease" }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", cursor: "pointer", display: "flex", alignItems: "center", gap: 18, padding: "22px 26px", background: "transparent", border: "none", textAlign: "left" }}>
              <span className="site-serif" style={{ fontSize: 14, color: "var(--gold)", minWidth: 24 }}>{(i + 1 < 10 ? "0" : "") + (i + 1)}</span>
              <span style={{ flex: 1, fontSize: 16, lineHeight: 1.5, color: "var(--head-2)" }}>{f.q}</span>
              <span style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(2,136,209,.4)", display: "grid", placeItems: "center", fontSize: 16, color: "var(--gold)", flex: "0 0 32px" }}>{isOpen ? "−" : "+"}</span>
            </button>
            <div style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.2,.7,.2,1), opacity .4s ease" }}>
              <p style={{ margin: 0, padding: "0 26px 24px 68px", fontSize: 14, lineHeight: 1.85, color: "var(--txt-mid)" }}>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
