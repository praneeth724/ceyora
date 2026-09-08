import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { HomePackageCard } from "@/components/site/home-cards";

const PERKS = [
  { icon: "◎", title: "Authentic", sub: "Local experiences" },
  { icon: "⌂", title: "Handpicked", sub: "Accommodations" },
  { icon: "❧", title: "Sustainable", sub: "Travel" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.title ?? "Category" };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { packages: { orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }] } },
  });
  if (!category) notFound();

  const hero = category.coverImage || category.cardImage || "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya_Rock.jpg?width=1800";

  return (
    <div>
      <section style={{ position: "relative", minHeight: 520, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div data-parallax="0.14" style={{ position: "absolute", inset: "-12% 0", backgroundImage: `url('${hero}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.97) 4%, rgba(4,30,40,.5) 55%, rgba(4,30,40,.72))" }} />
        <div className="site-container" style={{ position: "relative", paddingBottom: 54, width: "100%" }}>
          <Link href="/categories" style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(214,236,247,.65)" }}>← All categories</Link>
          <div className="site-eyebrow" style={{ margin: "22px 0 12px" }}>Tour category</div>
          <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,62px)", lineHeight: 1.03, margin: "0 0 18px", fontWeight: 500, color: "#F2FAFF" }}>{category.title}</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "rgba(214,236,247,.78)", maxWidth: 620, margin: "0 0 30px" }}>{category.description}</p>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            {PERKS.map((k) => (
              <span key={k.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(2,136,209,.45)", display: "grid", placeItems: "center", fontSize: 15, color: "#0288D1", flex: "0 0 38px" }}>{k.icon}</span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.35 }}>
                  <span style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "#F2FAFF" }}>{k.title}</span>
                  <span style={{ fontSize: 12, color: "rgba(214,236,247,.6)" }}>{k.sub}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="site-container" style={{ padding: "72px 0 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="site-eyebrow" style={{ marginBottom: 12 }}>{category.packages.length} journeys in this category</div>
          <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,42px)", margin: 0, fontWeight: 500, color: "var(--head)" }}>Explore {category.title} Packages</h2>
        </div>
        {category.packages.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--txt-mid)" }}>No packages in this category yet.</p>
        ) : (
          <div className="grid-3" style={{ gap: 22 }}>
            {category.packages.map((p) => (
              <HomePackageCard key={p.id} slug={p.slug} title={p.title} summary={p.summary} image={p.heroImage} days={p.days} nights={p.nights} price={p.price} dealPrice={p.dealPrice} badge={p.badge} />
            ))}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 46 }}>
          <Link href="/packages" className="btn-primary">Browse all packages →</Link>
        </div>
      </section>
    </div>
  );
}
