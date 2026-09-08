import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DestinationsExplorer } from "@/components/site/destinations-explorer";

export const metadata = { title: "Destinations" };

const W = (n: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${n}?width=1200`;

const STORIES = [
  { img: W("Mirissa_Beach.jpg"), small: "Salt air & slow days", title: "Coastal calm", cta: "Explore beaches", href: "/categories/beach-surf" },
  { img: W("Nine_Arches_Bridge.jpg"), small: "Trails & tea country", title: "Into the green", cta: "Find nature", href: "/categories/tea-country-trails" },
  { img: W("Sigiriya_Rock.jpg"), small: "Places with a story", title: "Living heritage", cta: "Discover culture", href: "/categories/ceylon-essentials" },
  { img: W("Sri_Lankan_leopard.jpg"), small: "The island, untamed", title: "Wild encounters", cta: "Explore wildlife", href: "/categories/wildlife-safari" },
];

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="destination-page">
      <DestinationsExplorer
        destinations={destinations.map((d) => ({
          slug: d.slug, name: d.name, tag: d.tag, shortDesc: d.shortDesc, hero: d.hero, pinTop: d.pinTop, pinLeft: d.pinLeft,
        }))}
      />

      {/* Island stories */}
      <section className="site-container" style={{ padding: "30px 0 100px" }}>
        <div className="island-stories">
          <span className="eyebrow">One island. So many ways to feel it.</span>
          <h2>Follow your curiosity.</h2>
          <div className="island-story-grid">
            {STORIES.map((s) => (
              <Link key={s.title} href={s.href} className="island-story">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" loading="lazy" />
                <small>{s.small}</small>
                <strong>{s.title}</strong>
                <span>{s.cta} <b aria-hidden="true">↗</b></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
