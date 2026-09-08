import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/site";
import { BookForm } from "@/components/site/book-form";

export const metadata = { title: "Book a Trip" };

const HERO = "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lanka_tea_plantation.jpg?width=1920";

export default async function BookPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const { package: pkgSlug } = await searchParams;
  const [packages, selected] = await Promise.all([
    prisma.package.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, price: true, dealPrice: true } }),
    pkgSlug
      ? prisma.package.findUnique({ where: { slug: pkgSlug }, include: { category: { select: { title: true } } } })
      : Promise.resolve(null),
  ]);

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", height: 460, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div data-parallax="0.12" style={{ position: "absolute", inset: "-12% 0", backgroundImage: `url('${HERO}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(95deg, rgba(4,30,40,.95), rgba(4,30,40,.5) 65%, rgba(4,30,40,.7))" }} />
        <div className="site-container" style={{ position: "relative", width: "100%" }}>
          <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,62px)", lineHeight: 1.02, margin: 0, fontWeight: 500, color: "#F2FAFF" }}>Book Your</h1>
          <div className="site-serif" style={{ fontStyle: "italic", fontSize: "clamp(32px,5vw,52px)", color: "#4FC3F7", margin: "0 0 18px", lineHeight: 1.05 }}>Journey</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(214,236,247,.75)", maxWidth: 440, margin: 0 }}>A perfect blend of wild nature, rich culture and warm people. Confirm your dates and we handle the rest.</p>
        </div>
      </section>

      {/* Package details */}
      {selected && (
        <section className="site-container" style={{ padding: "64px 0 0" }}>
          <h2 className="site-serif" style={{ fontSize: 38, margin: "0 0 26px", fontWeight: 500, color: "var(--head)" }}>Your Package <span style={{ color: "var(--gold)" }}>Details</span></h2>
          <div className="grid-2" style={{ border: "1px solid var(--bd-soft)", borderRadius: 18, overflow: "hidden", background: "var(--panel)", minHeight: 300, gap: 0 }}>
            <div style={{ position: "relative", minHeight: 300 }}>
              <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${selected.heroImage || HERO}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.8), rgba(4,30,40,.1))" }} />
              <span style={{ position: "absolute", left: 20, bottom: 18, fontSize: 12.5, color: "rgba(244,251,255,.9)" }}>◷ {selected.days} days / {selected.nights} nights</span>
            </div>
            <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
              {selected.category && <span className="site-eyebrow">{selected.category.title}</span>}
              <span className="site-serif" style={{ fontSize: 34, lineHeight: 1.15, color: "var(--head)" }}>{selected.title}</span>
              {selected.summary && <span style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--txt-mid)" }}>{selected.summary}</span>}
              <span style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 6 }}>
                <span className="site-serif" style={{ fontSize: 34, color: "var(--gold)" }}>{formatPrice(selected.dealPrice ?? selected.price)}</span>
                <span style={{ fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--txt-faint)" }}>per person</span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Booking form */}
      <section className="site-container" style={{ padding: "34px 0 110px" }}>
        <div style={{ border: "1px solid var(--bd-soft)", borderRadius: 18, background: "var(--panel)", padding: 44 }}>
          <h2 className="site-serif" style={{ fontSize: 30, margin: "0 0 28px", fontWeight: 500, color: "var(--head)" }}>Booking Now</h2>
          <BookForm packages={packages} defaultPackageId={selected?.id ?? null} />
        </div>
      </section>
    </div>
  );
}
