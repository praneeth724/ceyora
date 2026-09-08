"use client";

import { useMemo, useState } from "react";
import { HomePackageCard } from "./home-cards";

export interface PkgItem {
  slug: string; title: string; summary: string | null; heroImage: string | null;
  days: number; nights: number; price: number; dealPrice: number | null; badge: string | null;
  categoryTitle: string | null;
}

export function PackagesGrid({ packages }: { packages: PkgItem[] }) {
  const cats = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((p) => p.categoryTitle && set.add(p.categoryTitle));
    return ["All packages", ...Array.from(set)];
  }, [packages]);
  const [tab, setTab] = useState("All packages");

  const shown = tab === "All packages" ? packages : packages.filter((p) => p.categoryTitle === tab);

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 34 }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setTab(c)}
            style={{
              padding: "11px 22px", borderRadius: 4, fontSize: 12.5, letterSpacing: ".06em", cursor: "pointer",
              background: tab === c ? "var(--gold)" : "var(--bd-soft)",
              border: "1px solid " + (tab === c ? "var(--gold)" : "var(--bd-soft)"),
              color: tab === c ? "#fff" : "var(--txt)",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid-3" style={{ gap: 22 }}>
        {shown.map((p) => (
          <HomePackageCard key={p.slug} {...p} image={p.heroImage} />
        ))}
      </div>
    </>
  );
}
