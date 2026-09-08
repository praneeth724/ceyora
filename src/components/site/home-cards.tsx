import Link from "next/link";
import { formatPrice } from "@/lib/site";

const RADIUS = "54px 18px 18px 18px";

function bg(url: string | null, fallback = "linear-gradient(135deg,#062c3a,#01579b)") {
  return url ? `url('${url}')` : fallback;
}

export function HomeCategoryCard({
  slug, title, blurb, image, count,
}: {
  slug: string; title: string; blurb: string; image: string | null; count: number;
}) {
  return (
    <Link href={`/categories/${slug}`} style={{ position: "relative", height: 400, borderRadius: RADIUS, overflow: "hidden", border: "1px solid var(--bd-soft)", display: "block" }}>
      <span style={{ position: "absolute", inset: 0, background: bg(image), backgroundSize: "cover", backgroundPosition: "center" }} />
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.96) 4%, rgba(4,30,40,.55) 46%, rgba(4,30,40,.15))" }} />
      <span className="site-badge" style={{ position: "absolute", top: 16, right: 16 }}>{count} {count === 1 ? "tour" : "tours"}</span>
      <span style={{ position: "absolute", left: 22, right: 22, bottom: 22, display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="site-serif" style={{ fontSize: 27, lineHeight: 1.15, color: "#F2FAFF" }}>{title}</span>
        <span style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(214,236,247,.72)", maxHeight: 66, overflow: "hidden" }}>{blurb}</span>
        <span style={{ marginTop: 6, paddingTop: 14, borderTop: "1px solid rgba(214,236,247,.2)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#4FC3F7" }}>
          View more details <span style={{ fontSize: 14 }}>→</span>
        </span>
      </span>
    </Link>
  );
}

export function FeaturedDestinationCard({
  slug, name, tag, image,
}: {
  slug: string; name: string; tag: string | null; image: string | null;
}) {
  return (
    <Link href={`/destinations/${slug}`} className="featured-destination" style={{ position: "relative", height: 340, borderRadius: RADIUS, overflow: "hidden", display: "block", border: "1px solid var(--bd-soft)" }}>
      <span style={{ position: "absolute", inset: 0, background: bg(image), backgroundSize: "cover", backgroundPosition: "center" }} />
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.94) 8%, rgba(4,30,40,.15) 60%, rgba(4,30,40,.35))" }} />
      <span style={{ position: "absolute", left: 16, right: 16, bottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="site-serif" style={{ fontSize: 21, color: "#F2FAFF" }}>{name}</span>
        <span style={{ fontSize: 12, color: "rgba(214,236,247,.66)" }}>{tag || "Sri Lanka"}</span>
        <span className="destination-discover">Explore destination <b aria-hidden="true">↗</b></span>
      </span>
    </Link>
  );
}

export function HomePackageCard({
  slug, title, summary, image, days, nights, price, dealPrice, badge,
}: {
  slug: string; title: string; summary: string | null; image: string | null;
  days: number; nights: number; price: number; dealPrice: number | null; badge: string | null;
}) {
  return (
    <Link href={`/packages/${slug}`} style={{ position: "relative", height: 440, borderRadius: RADIUS, overflow: "hidden", border: "1px solid var(--bd-soft)", display: "block", boxShadow: "0 10px 30px rgba(2,12,18,.28)" }}>
      <span style={{ position: "absolute", inset: 0, background: bg(image), backgroundSize: "cover", backgroundPosition: "center" }} />
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.96) 4%, rgba(4,30,40,.5) 44%, rgba(4,30,40,.12))" }} />
      {badge && (
        <span style={{ position: "absolute", top: 14, right: 14, padding: "7px 16px", borderRadius: 999, background: "#0288D1", color: "#fff", fontSize: 10.5, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>{badge}</span>
      )}
      <span style={{ position: "absolute", left: 22, right: 22, bottom: 20, display: "flex", flexDirection: "column", gap: 9 }}>
        <span className="site-serif" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.12, color: "#F2FAFF" }}>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(214,236,247,.85)" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{days}</span> Days
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginLeft: 7 }}>{nights}</span> Nights
        </span>
        {summary && <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "rgba(214,236,247,.74)", maxHeight: 40, overflow: "hidden" }}>{summary}</span>}
        <span style={{ marginTop: 8, paddingTop: 14, borderTop: "1px solid rgba(214,236,247,.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="site-serif" style={{ fontSize: 30, fontWeight: 600, lineHeight: 1, color: "#fff" }}>{formatPrice(dealPrice ?? price)}</span>
            <span style={{ fontSize: 11, color: "rgba(214,236,247,.7)" }}>/ pp</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#4FC3F7", borderBottom: "1px solid rgba(79,195,247,.55)", paddingBottom: 3 }}>
            View Details <span style={{ fontSize: 14 }}>→</span>
          </span>
        </span>
      </span>
    </Link>
  );
}

export function JournalCard({
  slug, title, excerpt, image, category, date,
}: {
  slug: string; title: string; excerpt: string | null; image: string | null; category: string | null; date: string;
}) {
  return (
    <Link href={`/blog/${slug}`} style={{ display: "flex", flexDirection: "column", border: "1px solid var(--bd-soft)", borderRadius: RADIUS, overflow: "hidden", background: "var(--panel)" }}>
      <span style={{ position: "relative", height: 210, overflow: "hidden", display: "block" }}>
        <span style={{ position: "absolute", inset: 0, background: bg(image), backgroundSize: "cover", backgroundPosition: "center" }} />
        <span style={{ position: "absolute", top: 14, left: 14, padding: "6px 14px", borderRadius: 999, background: "rgba(4,30,40,.75)", border: "1px solid rgba(2,136,209,.4)", fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-l)" }}>{category || "Journal"}</span>
      </span>
      <span style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <span style={{ fontSize: 11.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{date} · 4 min read</span>
        <span className="site-serif" style={{ fontSize: 22, lineHeight: 1.3, color: "var(--head)" }}>{title}</span>
        {excerpt && <span style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--txt-mid)" }}>{excerpt}</span>}
        <span style={{ marginTop: "auto", paddingTop: 14, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--gold)" }}>Read story →</span>
      </span>
    </Link>
  );
}
