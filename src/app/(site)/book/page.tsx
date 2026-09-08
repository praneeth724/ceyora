import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";
import { BookForm } from "@/components/site/book-form";

export const metadata = { title: "Book a Trip" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: pkgSlug } = await searchParams;
  const [packages, selected] = await Promise.all([
    prisma.package.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    pkgSlug
      ? prisma.package.findUnique({ where: { slug: pkgSlug }, select: { id: true } })
      : Promise.resolve(null),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="Plan your dream getaway"
        title="Book Your Trip"
        subtitle="Tell us your plans and we'll craft the perfect Sri Lankan journey for you."
      />
      <section className="site-container" style={{ paddingTop: 48, maxWidth: 820 }}>
        <BookForm packages={packages} defaultPackageId={selected?.id ?? null} />
      </section>
    </>
  );
}
