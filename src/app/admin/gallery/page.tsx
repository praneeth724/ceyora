import { prisma } from "@/lib/prisma";
import { guardPage } from "@/lib/guard";
import { PageHeader } from "@/components/admin/page-header";
import { GalleryManager } from "@/components/admin/gallery/gallery-manager";

export default async function AdminGalleryPage() {
  await guardPage("gallery");
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader title="Gallery" description="Upload images shown on the public gallery page." />
      <GalleryManager images={images.map((g) => ({ id: g.id, title: g.title, image: g.image }))} />
    </div>
  );
}
