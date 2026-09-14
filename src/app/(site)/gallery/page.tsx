import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";
import { IMG } from "@/lib/site-images";

export const metadata = { title: "Gallery" };

function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

export default async function GalleryPage() {
  const [adminImages, destinations, packages] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.destination.findMany({ select: { name: true, hero: true, gallery: true } }),
    prisma.package.findMany({ select: { title: true, heroImage: true, gallery: true } }),
  ]);

  const images: { src: string; caption: string }[] = [];
  for (const a of adminImages) images.push({ src: a.image, caption: a.title || "Ceyora" });
  for (const d of destinations) {
    if (d.hero) images.push({ src: d.hero, caption: d.name });
    for (const g of arr(d.gallery)) images.push({ src: g, caption: d.name });
  }
  for (const p of packages) {
    if (p.heroImage) images.push({ src: p.heroImage, caption: p.title });
    for (const g of arr(p.gallery)) images.push({ src: g, caption: p.title });
  }

  const fallback = [
    { src: IMG.train, caption: "Nine Arch Bridge" },
    { src: IMG.beach, caption: "Mirissa Beach" },
    { src: IMG.sigiriya, caption: "Sigiriya" },
    { src: IMG.teaHills, caption: "Tea Country" },
    { src: IMG.kandyTemple, caption: "Kandy" },
    { src: IMG.galleFort, caption: "Galle Fort" },
    { src: IMG.leopard, caption: "Yala" },
    { src: IMG.nilaveli, caption: "Nilaveli" },
  ];
  const items = images.length >= 4 ? images : [...images, ...fallback];

  return (
    <>
      <PageBanner
        eyebrow="Our gallery"
        title="Captured Moments"
        subtitle="Every frame tells a story of beauty, culture and adventure across the island."
      />
      <section className="site-container" style={{ paddingTop: 48 }}>
        <div style={{ columnGap: 16, columnWidth: 260 }}>
          {items.map((img, i) => (
            <div key={i} style={{ breakInside: "avoid", marginBottom: 16, borderRadius: 14, overflow: "hidden", border: "1px solid var(--bd-soft)", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.caption} loading="lazy" style={{ width: "100%", display: "block" }} />
              <span style={{ position: "absolute", left: 12, bottom: 10, fontSize: 12, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,.8)" }}>{img.caption}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
