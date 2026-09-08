import { prisma } from "@/lib/prisma";
import { PackagesGrid } from "@/components/site/packages-grid";

export const metadata = { title: "Tour Packages" };

const HERO = "https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Lanka_Railways.jpg?width=1800";

export default async function PackagesListPage() {
  const packages = await prisma.package.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }],
    include: { category: { select: { title: true } } },
  });

  return (
    <div>
      <section style={{ position: "relative", height: 340, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${HERO}')`, backgroundSize: "cover", backgroundPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,30,40,.95), rgba(4,30,40,.6))" }} />
        <div className="site-container" style={{ position: "relative", width: "100%" }}>
          <div className="site-eyebrow" style={{ marginBottom: 12 }}>Journeys made for you</div>
          <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,58px)", margin: 0, fontWeight: 500, color: "#F2FAFF" }}>Tour Packages</h1>
        </div>
      </section>

      <section className="site-container" style={{ padding: "48px 0 110px" }}>
        <PackagesGrid
          packages={packages.map((p) => ({
            slug: p.slug, title: p.title, summary: p.summary, heroImage: p.heroImage,
            days: p.days, nights: p.nights, price: p.price, dealPrice: p.dealPrice, badge: p.badge,
            categoryTitle: p.category?.title ?? null,
          }))}
        />
      </section>
    </div>
  );
}
