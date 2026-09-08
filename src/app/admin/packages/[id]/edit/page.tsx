import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { PackageForm } from "@/components/admin/packages/package-form";

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardPage("packages");
  const id = Number((await params).id);
  const [pkg, categories, destinations] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: { destinations: { select: { id: true } } },
    }),
    prisma.category.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.destination.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!pkg) notFound();

  return (
    <div>
      <PageHeader title="Edit Package" description={pkg.title} />
      <PackageForm
        categories={categories}
        destinations={destinations}
        initial={{
          id: pkg.id,
          title: pkg.title,
          summary: pkg.summary,
          badge: pkg.badge,
          days: pkg.days,
          nights: pkg.nights,
          price: pkg.price,
          dealPercent: pkg.dealPercent,
          dealPrice: pkg.dealPrice,
          isFeatured: pkg.isFeatured,
          heroImage: pkg.heroImage,
          overview: pkg.overview,
          gallery: arr<string>(pkg.gallery),
          journey: arr(pkg.journey),
          route: arr(pkg.route),
          included: arr<string>(pkg.included),
          excluded: arr<string>(pkg.excluded),
          faq: arr(pkg.faq),
          categoryId: pkg.categoryId,
          destinationIds: pkg.destinations.map((d) => d.id),
        }}
      />
    </div>
  );
}
