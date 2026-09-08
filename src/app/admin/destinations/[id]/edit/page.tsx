import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { DestinationForm } from "@/components/admin/destinations/destination-form";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardPage("destinations");
  const id = Number((await params).id);
  const d = await prisma.destination.findUnique({ where: { id } });
  if (!d) notFound();

  return (
    <div>
      <PageHeader title="Edit Destination" description={d.name} />
      <DestinationForm
        initial={{
          id: d.id,
          name: d.name,
          tag: d.tag,
          subtitle: d.subtitle,
          description: d.description,
          shortDesc: d.shortDesc,
          hero: d.hero,
          gallery: Array.isArray(d.gallery) ? (d.gallery as string[]) : [],
          rating: d.rating,
          pinTop: d.pinTop,
          pinLeft: d.pinLeft,
          latitude: d.latitude,
          longitude: d.longitude,
          isFeatured: d.isFeatured,
        }}
      />
    </div>
  );
}
