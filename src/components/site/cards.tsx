import Link from "next/link";
import { formatPrice } from "@/lib/site";

/** Gradient placeholder shown when an item has no image. */
function Placeholder({ label }: { label?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, #062c3a, #01579b)",
        display: "grid",
        placeItems: "center",
        color: "rgba(242,250,255,.4)",
        fontSize: 13,
        letterSpacing: ".2em",
        textTransform: "uppercase",
      }}
    >
      {label ?? "Ceyora"}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 24,
        marginBottom: 30,
        flexWrap: "wrap",
      }}
    >
      <div>
        {eyebrow && <div className="site-eyebrow" style={{ marginBottom: 12 }}>{eyebrow}</div>}
        <h2 className="site-h2">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export function CategoryCard({
  category,
}: {
  category: { slug: string; title: string; description: string; coverImage: string | null; cardImage: string | null; count?: number };
}) {
  const img = category.cardImage || category.coverImage;
  return (
    <Link href={`/categories/${category.slug}`} className="site-card" style={{ position: "relative", display: "block", height: 400 }}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={category.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Placeholder label={category.title} />
      )}
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.96) 4%, rgba(4,30,40,.5) 46%, rgba(4,30,40,.12))" }} />
      {typeof category.count === "number" && (
        <span className="site-badge" style={{ position: "absolute", top: 16, right: 16 }}>
          {category.count} {category.count === 1 ? "tour" : "tours"}
        </span>
      )}
      <span style={{ position: "absolute", left: 22, right: 22, bottom: 22, display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="site-serif" style={{ fontSize: 26, lineHeight: 1.15, color: "#F2FAFF" }}>{category.title}</span>
        <span style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(214,236,247,.72)", maxHeight: 62, overflow: "hidden" }}>{category.description}</span>
        <span style={{ marginTop: 6, paddingTop: 12, borderTop: "1px solid rgba(214,236,247,.2)", display: "flex", justifyContent: "space-between", fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#4FC3F7" }}>
          View details <span>→</span>
        </span>
      </span>
    </Link>
  );
}

export function PackageCard({
  pkg,
}: {
  pkg: {
    slug: string;
    title: string;
    summary: string | null;
    heroImage: string | null;
    days: number;
    nights: number;
    price: number;
    dealPrice: number | null;
    badge: string | null;
    category?: { title: string } | null;
  };
}) {
  return (
    <Link href={`/packages/${pkg.slug}`} className="site-card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 220 }}>
        {pkg.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pkg.heroImage} alt={pkg.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Placeholder label={pkg.title} />
        )}
        {pkg.badge && (
          <span className="site-badge" style={{ position: "absolute", top: 14, left: 14 }}>{pkg.badge}</span>
        )}
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {pkg.category && (
          <span style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-l)" }}>{pkg.category.title}</span>
        )}
        <h3 className="site-serif" style={{ fontSize: 22, color: "var(--head)", margin: 0, lineHeight: 1.2 }}>{pkg.title}</h3>
        {pkg.summary && <p style={{ fontSize: 13.5, color: "var(--txt-mid)", margin: 0, lineHeight: 1.6 }}>{pkg.summary}</p>}
        <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--bd-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, color: "var(--txt-faint)" }}>{pkg.days}D / {pkg.nights}N</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--head)" }}>
            {pkg.dealPrice ? (
              <>
                <span style={{ textDecoration: "line-through", color: "var(--txt-faint)", fontSize: 13, marginRight: 6 }}>{formatPrice(pkg.price)}</span>
                {formatPrice(pkg.dealPrice)}
              </>
            ) : (
              formatPrice(pkg.price)
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function DestinationCard({
  destination,
}: {
  destination: { slug: string; name: string; tag: string | null; shortDesc: string | null; hero: string | null; rating: string | null };
}) {
  return (
    <Link href={`/destinations/${destination.slug}`} className="site-card" style={{ position: "relative", display: "block", height: 320 }}>
      {destination.hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={destination.hero} alt={destination.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Placeholder label={destination.name} />
      )}
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.95), transparent 60%)" }} />
      {destination.rating && (
        <span className="site-badge" style={{ position: "absolute", top: 14, right: 14 }}>★ {destination.rating}</span>
      )}
      <span style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
        {destination.tag && <span style={{ display: "block", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--gold-l)", marginBottom: 6 }}>{destination.tag}</span>}
        <span className="site-serif" style={{ fontSize: 24, color: "#F2FAFF" }}>{destination.name}</span>
      </span>
    </Link>
  );
}

export function BlogCard({
  post,
}: {
  post: { slug: string; title: string; excerpt: string | null; coverImage: string | null; category: string | null; publishedAt: string };
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="site-card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 190 }}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Placeholder label="Journal" />
        )}
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-l)" }}>
          {post.category || "Journal"} · {new Date(post.publishedAt).toLocaleDateString()}
        </span>
        <h3 className="site-serif" style={{ fontSize: 20, color: "var(--head)", margin: 0, lineHeight: 1.25 }}>{post.title}</h3>
        {post.excerpt && <p style={{ fontSize: 13.5, color: "var(--txt-mid)", margin: 0, lineHeight: 1.6 }}>{post.excerpt}</p>}
      </div>
    </Link>
  );
}
