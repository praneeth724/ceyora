import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";
import { PackageCard, SectionHeader } from "@/components/site/cards";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  return { title: category?.title ?? "Category" };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      packages: {
        orderBy: { createdAt: "desc" },
        include: { category: { select: { title: true } } },
      },
    },
  });
  if (!category) notFound();

  return (
    <>
      <PageBanner eyebrow="Tour Category" title={category.title} subtitle={category.description} />
      <section className="site-container" style={{ paddingTop: 48 }}>
        <SectionHeader title={`Packages in ${category.title}`} />
        {category.packages.length === 0 ? (
          <p style={{ color: "var(--txt-mid)" }}>No packages in this category yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {category.packages.map((p) => (
              <PackageCard
                key={p.id}
                pkg={{ slug: p.slug, title: p.title, summary: p.summary, heroImage: p.heroImage, days: p.days, nights: p.nights, price: p.price, dealPrice: p.dealPrice, badge: p.badge, category: p.category }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
