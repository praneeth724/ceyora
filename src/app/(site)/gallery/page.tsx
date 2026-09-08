import { prisma } from "@/lib/prisma";
import { PageBanner } from "@/components/site/page-banner";

export const metadata = { title: "Gallery" };

const WIKI = (name: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=1200`;

function arr(v: unknown): string[] {
  return Array.isArray(v) ? (v as string[]) : [];
}

export default async function GalleryPage() {
  const [destinations, packages] = await Promise.all([
    prisma.destination.findMany({ select: { name: true, hero: true, gallery: true } }),
    prisma.package.findMany({ select: { title: true, heroImage: true, gallery: true } }),
  ]);

  const images: { src: string; caption: string }[] = [];
  for (const d of destinations) {
    if (d.hero) images.push({ src: d.hero, caption: d.name });
    for (const g of arr(d.gallery)) images.push({ src: g, caption: d.name });
  }
  for (const p of packages) {
    if (p.heroImage) images.push({ src: p.heroImage, caption: p.title });
    for (const g of arr(p.gallery)) images.push({ src: g, caption: p.title });
  }

  const fallback = [
    { src: WIKI("Nine_Arches_Bridge.jpg"), caption: "Nine Arch Bridge" },
    { src: WIKI("Mirissa_Beach.jpg"), caption: "Mirissa Beach" },
    { src: WIKI("Sigiriya_Rock.jpg"), caption: "Sigiriya" },
    { src: WIKI("Sri_Lanka_tea_plantation.jpg"), caption: "Tea Country" },
    { src: WIKI("Temple_of_the_Tooth.jpg"), caption: "Kandy" },
    { src: WIKI("Galle_Fort.jpg"), caption: "Galle Fort" },
    { src: WIKI("Yala_National_Park.jpg"), caption: "Yala" },
    { src: WIKI("Nilaveli_Beach.jpg"), caption: "Nilaveli" },
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
