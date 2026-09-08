"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface PostItem {
  slug: string; title: string; excerpt: string | null; coverImage: string | null;
  category: string | null; author: string | null; date: string;
}

export function BlogList({ posts }: { posts: PostItem[] }) {
  const cats = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);
  const [tab, setTab] = useState("All");

  const filtered = tab === "All" ? posts : posts.filter((p) => p.category === tab);
  const lead = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Featured lead */}
      {lead && (
        <section className="site-container" style={{ padding: "0 0 34px" }}>
          <Link href={`/blog/${lead.slug}`} className="blog-lead" style={{ display: "grid", border: "1px solid var(--bd-soft)", borderRadius: "54px 18px 18px 18px", overflow: "hidden", background: "var(--panel)", minHeight: 400 }}>
            <span style={{ position: "relative", overflow: "hidden", display: "block", minHeight: 240 }}>
              <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${lead.coverImage || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(4,30,40,.1), rgba(4,30,40,.5))" }} />
              <span style={{ position: "absolute", top: 18, left: 18, padding: "7px 16px", borderRadius: 999, background: "rgba(4,30,40,.75)", border: "1px solid rgba(2,136,209,.45)", fontSize: 10.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)" }}>Featured</span>
            </span>
            <span style={{ padding: "52px 48px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
              <span style={{ fontSize: 11.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold)" }}>{lead.category}</span>
              <span className="site-serif" style={{ fontSize: "clamp(28px,3.5vw,38px)", lineHeight: 1.18, color: "var(--head)" }}>{lead.title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.85, color: "var(--txt)" }}>{lead.excerpt}</span>
              <span style={{ fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{lead.date}</span>
              <span className="btn-ghost" style={{ alignSelf: "flex-start", borderRadius: 999, marginTop: 12 }}>Read the story →</span>
            </span>
          </Link>
        </section>
      )}

      {/* Tabs + grid */}
      <section className="site-container" style={{ padding: "0 0 110px" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setTab(c)} style={{ padding: "11px 22px", borderRadius: 4, fontSize: 12.5, letterSpacing: ".06em", cursor: "pointer", background: tab === c ? "var(--gold)" : "var(--bd-soft)", border: "1px solid " + (tab === c ? "var(--gold)" : "var(--bd-soft)"), color: tab === c ? "#fff" : "var(--txt)" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 className="site-serif" style={{ fontSize: 32, margin: 0, fontWeight: 500, color: "var(--head)" }}>{tab === "All" ? "Latest stories" : tab}</h2>
          <span style={{ fontSize: 12.5, color: "var(--txt-faint)" }}>{filtered.length} articles</span>
        </div>
        <div className="grid-3" style={{ gap: 20 }}>
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} style={{ display: "flex", flexDirection: "column", border: "1px solid var(--bd-soft)", borderRadius: "54px 18px 18px 18px", overflow: "hidden", background: "var(--panel)" }} className="site-card">
              <span style={{ position: "relative", height: 220, overflow: "hidden", display: "block" }}>
                <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${p.coverImage || "/site/hero.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <span style={{ position: "absolute", top: 14, left: 14, padding: "6px 14px", borderRadius: 999, background: "rgba(4,30,40,.75)", border: "1px solid rgba(2,136,209,.4)", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)" }}>{p.category}</span>
              </span>
              <span style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <span style={{ fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{p.date}</span>
                <span className="site-serif" style={{ fontSize: 22, lineHeight: 1.3, color: "var(--head)" }}>{p.title}</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--txt-mid)" }}>{p.excerpt}</span>
                <span style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--bd-soft)" }}>
                  <span style={{ fontSize: 12.5, color: "var(--txt-mid)" }}>{p.author}</span>
                  <span style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)" }}>Read →</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
