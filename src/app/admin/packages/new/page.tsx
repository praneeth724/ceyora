import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { PackageForm } from "@/components/admin/packages/package-form";

export default async function NewPackagePage() {
  await guardPage("packages");
  const [categories, destinations] = await Promise.all([
    prisma.category.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.destination.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <PageHeader title="New Package" description="Create a tour package." />
      <PackageForm categories={categories} destinations={destinations} />
    </div>
  );
}
