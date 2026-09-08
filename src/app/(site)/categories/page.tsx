import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";
import { CategoryCard } from "@/components/site/cards";

export const metadata = { title: "Tour Categories" };

export default async function CategoriesListPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { packages: true } } },
  });

  return (
    <>
      <PageBanner
        eyebrow="Browse by style of travel"
        title="Tour Categories"
        subtitle="Find the kind of journey that suits you — from beaches to ancient cities and wild highlands."
      />
      <section className="site-container" style={{ paddingTop: 48 }}>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--txt-mid)" }}>No categories yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {categories.map((c) => (
              <CategoryCard
                key={c.id}
                category={{ slug: c.slug, title: c.title, description: c.description, coverImage: c.coverImage, cardImage: c.cardImage, count: c._count.packages }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
