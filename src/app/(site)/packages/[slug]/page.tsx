import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, X, Clock, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/site";
import { FaqAccordion, type FaqItem } from "@/components/site/faq-accordion";
import { HomePackageCard } from "@/components/site/home-cards";

interface JourneyStep { day?: number; title: string; description: string }
interface RouteStep { from: string; to: string; note?: string }

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({ where: { slug } });
  return { title: pkg?.title ?? "Package" };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      category: { select: { title: true, slug: true } },
      destinations: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!pkg) notFound();

  const related = await prisma.package.findMany({
    where: { slug: { not: slug } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    take: 3,
  });

  const journey = arr<JourneyStep>(pkg.journey);
  const route = arr<RouteStep>(pkg.route);
  const included = arr<string>(pkg.included);
  const excluded = arr<string>(pkg.excluded);
  const faq = arr<FaqItem>(pkg.faq);
  const heroBg = pkg.heroImage || "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lanka_tea_plantation.jpg?width=1800";
  const stops = route.length ? [route[0].from, ...route.map((r) => r.to)] : [];

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", height: 520, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${heroBg}')`, backgroundSize: "cover", backgroundPosition: "center", animation: "kb 18s ease-out infinite alternate" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.97) 5%, rgba(4,30,40,.45) 55%, rgba(4,30,40,.7))" }} />
        <div className="site-container" style={{ position: "relative", paddingBottom: 54, width: "100%" }}>
          <Link href="/packages" style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--txt-mid)" }}>← All packages</Link>
          {pkg.category && <div className="site-eyebrow" style={{ margin: "22px 0 12px" }}>{pkg.category.title}</div>}
          <h1 className="site-serif" style={{ fontSize: "clamp(34px,5.5vw,62px)", lineHeight: 1.03, margin: "0 0 20px", fontWeight: 500, color: "#F2FAFF", maxWidth: 820 }}>{pkg.title}</h1>
          <Link href={`/book?package=${pkg.slug}`} className="btn-primary" style={{ marginBottom: 26 }}>Book Now →</Link>
          <div style={{ display: "flex", gap: 34, flexWrap: "wrap", fontSize: 13.5, color: "var(--txt)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={16} /> {pkg.days} days / {pkg.nights} nights</span>
            {pkg.category && <span style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={16} /> {pkg.category.title}</span>}
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Users size={16} /> Small group</span>
          </div>
        </div>
      </section>

      {/* Overview + Day by Day | sidebar */}
      <section className="site-container" style={{ padding: "64px 0 100px" }}>
        <div className="pkg-main-grid">
          <div style={{ minWidth: 0 }}>
            {pkg.overview && (
              <>
                <h2 className="site-serif" style={{ fontSize: 34, margin: "0 0 14px", fontWeight: 500, color: "var(--head)" }}>Overview</h2>
                <p style={{ fontSize: 15.5, lineHeight: 1.9, color: "var(--txt)", margin: "0 0 48px" }}>{pkg.overview}</p>
              </>
            )}

            {journey.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 30 }}>
                  <h2 className="site-serif" style={{ fontSize: 34, margin: 0, fontWeight: 500, color: "var(--head)" }}>Day by Day</h2>
                  <span style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{pkg.days} days</span>
                </div>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 26 }}>
                  <span style={{ position: "absolute", left: 29, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, rgba(2,136,209,.05), rgba(2,136,209,.45), rgba(2,136,209,.05))" }} />
                  {journey.map((d, i) => (
                    <div key={i} data-reveal="1" style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 24, alignItems: "stretch" }}>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16 }}>
                        <span style={{ width: 58, height: 58, borderRadius: "50%", border: "1px solid rgba(2,136,209,.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg)", lineHeight: 1 }}>
                          <span style={{ fontSize: 8.5, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--txt-faint)", marginBottom: 3 }}>Day</span>
                          <span className="site-serif" style={{ fontSize: 20, color: "var(--gold)" }}>{d.day ?? i + 1}</span>
                        </span>
                      </span>
                      <div style={{ border: "1px solid var(--bd-soft)", borderRadius: 16, background: "var(--panel)", padding: "26px 30px", display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                        <span className="site-serif" style={{ fontSize: 22, lineHeight: 1.25, color: "var(--head)" }}>{d.title}</span>
                        <span style={{ fontSize: 14, lineHeight: 1.85, color: "var(--txt-mid)", whiteSpace: "pre-wrap" }}>{d.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sticky booking sidebar */}
          <aside style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ border: "1px solid rgba(2,136,209,.3)", borderRadius: 16, background: "var(--panel-2)", padding: 28 }}>
              <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--txt-mid)" }}>From per person</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "6px 0 22px" }}>
                <span className="site-serif" style={{ fontSize: 42, color: "var(--gold)" }}>{formatPrice(pkg.dealPrice ?? pkg.price)}</span>
                {pkg.dealPrice && <span style={{ fontSize: 13, color: "var(--txt-faint)", textDecoration: "line-through" }}>{formatPrice(pkg.price)}</span>}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px", display: "grid", gap: 12, fontSize: 14, color: "var(--txt)" }}>
                <li style={{ display: "flex", justifyContent: "space-between" }}><span>Duration</span><span>{pkg.days}D / {pkg.nights}N</span></li>
                {pkg.category && <li style={{ display: "flex", justifyContent: "space-between" }}><span>Category</span><span>{pkg.category.title}</span></li>}
              </ul>
              <Link href={`/book?package=${pkg.slug}`} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}>Book this trip</Link>
              <Link href="/contact" className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>Talk to an expert</Link>
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--bd-soft)", fontSize: 12.5, lineHeight: 1.8, color: "var(--txt-mid)" }}>Free cancellation up to 14 days before departure. No booking fees.</div>
            </div>
          </aside>
        </div>

        {/* Tour route + included */}
        {stops.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <div className="site-eyebrow" style={{ marginBottom: 12 }}>Your path across Sri Lanka</div>
            <h2 className="site-serif" style={{ fontSize: 40, margin: "0 0 20px", fontWeight: 500, color: "var(--head)" }}>Tour Route</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {stops.map((s, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="site-badge">{s}</span>
                  {i < stops.length - 1 && <span style={{ color: "var(--gold)" }}>→</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {(included.length > 0 || excluded.length > 0) && (
          <div className="grid-2" style={{ gap: 24, marginTop: 48 }}>
            {included.length > 0 && (
              <div>
                <h3 className="site-serif" style={{ fontSize: 24, color: "var(--head)", margin: "0 0 14px" }}>What&apos;s included</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                  {included.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--txt)" }}><Check size={18} style={{ color: "#4FC3F7", flexShrink: 0 }} /> {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {excluded.length > 0 && (
              <div>
                <h3 className="site-serif" style={{ fontSize: 24, color: "var(--head)", margin: "0 0 14px" }}>Not included</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
                  {excluded.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "var(--txt-mid)" }}><X size={18} style={{ color: "var(--txt-faint)", flexShrink: 0 }} /> {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div className="site-eyebrow" style={{ marginBottom: 12 }}>Good to know</div>
            <h2 className="site-serif" style={{ fontSize: 40, lineHeight: 1.08, margin: "0 0 26px", fontWeight: 500, color: "var(--head)" }}>Frequently Asked Questions</h2>
            <FaqAccordion items={faq} />
          </div>
        )}

        {/* You may also like */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2 className="site-serif" style={{ fontSize: 34, margin: "0 0 24px", fontWeight: 500, color: "var(--head)" }}>You may also like</h2>
            <div className="grid-3" style={{ gap: 22 }}>
              {related.map((p) => (
                <HomePackageCard key={p.id} slug={p.slug} title={p.title} summary={p.summary} image={p.heroImage} days={p.days} nights={p.nights} price={p.price} dealPrice={p.dealPrice} badge={p.badge} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
