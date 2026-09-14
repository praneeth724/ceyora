import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PackageCard, SectionHeader } from "@/components/site/cards";
import { IMG } from "@/lib/site-images";

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = await prisma.destination.findUnique({ where: { slug } });
  return { title: d?.name ?? "Destination" };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await prisma.destination.findUnique({
    where: { slug },
    include: {
      packages: {
        orderBy: { createdAt: "desc" },
        include: { category: { select: { title: true } } },
      },
    },
  });
  if (!destination) notFound();

  const gallery = arr<string>(destination.gallery);
  const heroBg = destination.hero || IMG.sigiriya;

  return (
    <>
      <section style={{ position: "relative", minHeight: 460, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${heroBg}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(2,12,18,.35), rgba(4,30,40,.95))" }} />
        <div className="site-container" style={{ position: "relative", paddingTop: 140, paddingBottom: 44 }}>
          {destination.tag && <div className="site-eyebrow" style={{ marginBottom: 12 }}>{destination.tag}</div>}
          <h1 className="site-serif" style={{ fontSize: "clamp(34px,5vw,58px)", color: "#F2FAFF", margin: 0 }}>{destination.name}</h1>
          {destination.subtitle && (
            <p style={{ maxWidth: 640, marginTop: 14, color: "rgba(242,250,255,.85)", fontSize: 16, lineHeight: 1.7 }}>{destination.subtitle}</p>
          )}
        </div>
      </section>

      <section className="site-container" style={{ paddingTop: 48, maxWidth: 860 }}>
        <div className="site-prose" style={{ fontSize: 15.5 }}>{destination.description}</div>
      </section>

      {gallery.length > 0 && (
        <section className="site-container" style={{ paddingTop: 40 }}>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))" }}>
            {gallery.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={url} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, border: "1px solid var(--bd-soft)" }} />
            ))}
          </div>
        </section>
      )}

      {destination.packages.length > 0 && (
        <section className="site-container" style={{ paddingTop: 56 }}>
          <SectionHeader title={`Packages visiting ${destination.name}`} />
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {destination.packages.map((p) => (
              <PackageCard
                key={p.id}
                pkg={{ slug: p.slug, title: p.title, summary: p.summary, heroImage: p.heroImage, days: p.days, nights: p.nights, price: p.price, dealPrice: p.dealPrice, badge: p.badge, category: p.category }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="site-container" style={{ paddingTop: 56, textAlign: "center" }}>
        <Link href="/book" className="btn-primary">Plan a trip to {destination.name} →</Link>
      </section>
    </>
  );
}
