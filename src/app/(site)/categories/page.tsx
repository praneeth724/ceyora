import { prisma } from "@/lib/prisma";
import { HomeCategoryCard } from "@/components/site/home-cards";
import { IMG } from "@/lib/site-images";

export const metadata = { title: "Tour Categories" };

const HERO = IMG.train;

export default async function CategoriesListPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { packages: true } } },
  });

  return (
    <div>
      <section style={{ position: "relative", height: 400, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div className="px-fixed" style={{ position: "absolute", inset: 0, backgroundImage: `url('${HERO}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(95deg, rgba(4,30,40,.95), rgba(4,30,40,.5) 70%, rgba(4,30,40,.72))" }} />
        <div className="site-container" style={{ position: "relative", width: "100%" }}>
          <div className="site-eyebrow" style={{ marginBottom: 14 }}>Browse by style of travel</div>
          <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,60px)", lineHeight: 1.02, margin: "0 0 16px", fontWeight: 500, color: "#F2FAFF" }}>Tour Categories</h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(214,236,247,.75)", maxWidth: 480, margin: 0 }}>Pick the kind of trip you want. Each category holds the journeys we run for it — open one to see its packages.</p>
        </div>
      </section>

      <section className="site-container" style={{ padding: "64px 0 110px" }}>
        <div className="grid-3" style={{ gap: 20 }}>
          {categories.map((c) => (
            <HomeCategoryCard key={c.id} slug={c.slug} title={c.title} blurb={c.description} image={c.cardImage || c.coverImage} count={c._count.packages} />
          ))}
        </div>
      </section>
    </div>
  );
}
