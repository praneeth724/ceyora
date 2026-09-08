import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/site/hero";
import { MapExplorer } from "@/components/site/map-explorer";
import { GalleryReel, type ReelItem } from "@/components/site/gallery-reel";
import {
  HomeCategoryCard,
  FeaturedDestinationCard,
  HomePackageCard,
  JournalCard,
} from "@/components/site/home-cards";

const WIKI = (name: string, w = 1600) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${name}?width=${w}`;

const EXPERIENCES = [
  { number: "01", title: "Beaches", copy: "Golden sand, warm water and slow coastal days along the south and east.", img: WIKI("Mirissa_Beach.jpg"), href: "/categories" },
  { number: "02", title: "Highlands", copy: "Misty tea country, cool air and train rides through the clouds.", img: WIKI("Sri_Lanka_tea_plantation.jpg"), href: "/categories" },
  { number: "03", title: "Heritage", copy: "Ancient cities, sacred temples and stories centuries in the making.", img: WIKI("Sigiriya_Rock.jpg"), href: "/categories" },
];

const WHY_US = [
  { icon: "◈", title: "Local expertise", body: "Born on the island, we know its hidden corners." },
  { icon: "❤", title: "Authentic moments", body: "Real experiences, not tourist traps." },
  { icon: "✦", title: "Effortless travel", body: "Private drivers, handpicked stays, zero stress." },
  { icon: "☏", title: "Always supported", body: "A friendly team, reachable throughout your trip." },
];

const TESTIMONIALS = [
  { text: "The most seamless trip we've ever taken. Every detail was handled and every place felt special.", name: "Emily R.", from: "United Kingdom", trip: "Cultural Triangle", img: WIKI("Sigiriya_Rock.jpg", 200) },
  { text: "From the beaches to the tea hills, Sri Lanka stole our hearts. Our guide was wonderful.", name: "David & Anna", from: "Australia", trip: "Southern Coast", img: WIKI("Mirissa_Beach.jpg", 200) },
  { text: "Effortless, authentic and beautiful. We'll be back for the north next time.", name: "Sofia M.", from: "Spain", trip: "Wildlife Safari", img: WIKI("Sri_Lankan_leopard.jpg", 200) },
];

export default async function HomePage() {
  const [categories, destinations, packages, posts] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 4,
      include: { _count: { select: { packages: true } } },
    }),
    prisma.destination.findMany({ orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], take: 8 }),
    prisma.package.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.blog.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  // Build the gallery reel from available images (destinations + packages).
  const reelItems: ReelItem[] = [];
  for (const d of destinations) {
    if (d.hero) reelItems.push({ img: d.hero, caption: d.name, href: `/destinations/${d.slug}` });
  }
  for (const p of packages) {
    if (p.heroImage) reelItems.push({ img: p.heroImage, caption: p.title, href: `/packages/${p.slug}` });
  }
  const reelFallback: ReelItem[] = [
    { img: WIKI("Nine_Arches_Bridge.jpg"), caption: "Nine Arch Bridge" },
    { img: WIKI("Mirissa_Beach.jpg"), caption: "Mirissa Beach" },
    { img: WIKI("Sigiriya_Rock.jpg"), caption: "Sigiriya" },
    { img: WIKI("Sri_Lanka_tea_plantation.jpg"), caption: "Tea Country" },
    { img: WIKI("Temple_of_the_Tooth.jpg"), caption: "Kandy" },
    { img: WIKI("Galle_Fort.jpg"), caption: "Galle Fort" },
  ];
  const gallery = reelItems.length >= 4 ? reelItems : [...reelItems, ...reelFallback].slice(0, 6);

  const mapDest = destinations.slice(0, 8).map((d) => ({
    slug: d.slug, name: d.name, tag: d.tag, description: d.description, shortDesc: d.shortDesc,
    hero: d.hero, gallery: Array.isArray(d.gallery) ? (d.gallery as string[]) : [], pinTop: d.pinTop, pinLeft: d.pinLeft,
  }));

  const heroDest = destinations.slice(0, 6).map((d) => ({ slug: d.slug, name: d.name, tag: d.tag, hero: d.hero }));

  return (
    <>
      <Hero tagline={null} destinations={heroDest} />

      {/* Tour Categories */}
      {categories.length > 0 && (
        <section className="bgsec" style={{ padding: "72px 0" }}>
          <i className="bgl img" style={{ backgroundImage: `url('${WIKI("Unawatuna_beach.jpg")}')` }} />
          <i className="bgl scrim" />
          <div className="site-container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 30, flexWrap: "wrap" }}>
              <div>
                <div className="site-eyebrow" style={{ marginBottom: 12 }}>Browse by style of travel</div>
                <h2 className="site-h2">Tour Categories</h2>
              </div>
              <Link href="/packages" style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>All packages →</Link>
            </div>
            <div className="grid-4" style={{ gap: 16 }}>
              {categories.map((c) => (
                <HomeCategoryCard key={c.id} slug={c.slug} title={c.title} blurb={c.description} image={c.cardImage || c.coverImage} count={c._count.packages} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience editorial */}
      <section className="site-container" style={{ padding: "88px 0" }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
          <div>
            <span className="site-eyebrow">Your island, your rhythm</span>
            <h2 className="site-serif" style={{ fontWeight: 500, fontSize: "clamp(30px,4vw,52px)", lineHeight: 1.13, color: "var(--head)", margin: "14px 0 0" }}>What does your<br />perfect escape feel like?</h2>
          </div>
          <p style={{ maxWidth: 340, lineHeight: 1.8, color: "var(--txt-mid)", fontSize: 14 }}>A quiet stretch of sand. A trail above the clouds. A story centuries in the making. Start with what moves you.</p>
        </div>
        <div className="experience-grid">
          {EXPERIENCES.map((e) => (
            <Link key={e.number} href={e.href} className="experience-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.img} alt={e.title} loading="lazy" />
              <span className="number">{e.number}</span>
              <strong className="site-serif">{e.title}</strong>
              <span className="caption">{e.copy}</span>
              <span className="card-link">Discover <span>↗</span></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Slow feature parallax */}
      <section className="slow-feature">
        <div className="scenic-image" data-parallax="0.16" style={{ backgroundImage: `url('${WIKI("Sri_Lanka_tea_plantation.jpg", 1920)}')` }} />
        <div className="scenic-shade" />
        <div className="scenic-copy">
          <span className="site-eyebrow" style={{ color: "var(--gold-l)" }}>Take the scenic route</span>
          <h2 className="site-serif">Less rushing.<br /><em>More remembering.</em></h2>
          <p>Tea on a misty morning. An open train window. Time to stop just because the view is beautiful. Leave a little room for the unexpected.</p>
          <Link href="/packages" className="pill-link">Find your next journey <span>↗</span></Link>
        </div>
      </section>

      {/* Explore Sri Lanka map */}
      {mapDest.length > 0 && (
        <section style={{ position: "relative", padding: "110px 0", overflow: "hidden" }}>
          <div data-parallax="0.14" style={{ position: "absolute", inset: "-14% 0", backgroundImage: `url('${WIKI("Worlds_End_Sri_Lanka.jpg", 1920)}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,30,40,.93), rgba(4,30,40,.8) 45%, rgba(4,30,40,.95))" }} />
          <div className="site-container" style={{ position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="site-eyebrow" style={{ letterSpacing: ".34em", marginBottom: 14 }}>Click a pin</div>
              <h2 className="site-serif" style={{ fontSize: "clamp(34px,4vw,52px)", margin: "0 0 12px", fontWeight: 500, color: "#F2FAFF" }}>Explore Sri Lanka</h2>
              <p style={{ fontSize: 14.5, color: "rgba(214,236,247,.7)", margin: 0 }}>Discover the magic of each destination on the island.</p>
            </div>
            <MapExplorer destinations={mapDest} />
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      {destinations.length > 0 && (
        <section className="site-container" style={{ padding: "96px 0 0" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 34, flexWrap: "wrap" }}>
            <div>
              <div className="site-eyebrow" style={{ marginBottom: 12 }}>Explore the best</div>
              <h2 className="site-h2">Featured Destinations</h2>
            </div>
            <Link href="/destinations" style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>View all destinations →</Link>
          </div>
          <div className="grid-5" style={{ gap: 16 }}>
            {destinations.slice(0, 5).map((d) => (
              <FeaturedDestinationCard key={d.id} slug={d.slug} name={d.name} tag={d.tag} image={d.hero} />
            ))}
          </div>
        </section>
      )}

      {/* More than just a trip */}
      <section className="site-container" style={{ padding: "96px 0" }}>
        <div className="grid-2" style={{ gap: 64, alignItems: "center" }}>
          <div style={{ position: "relative", height: 480, borderRadius: 16, overflow: "hidden", border: "1px solid var(--bd-soft)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${WIKI("Nine_Arches_Bridge.jpg", 1400)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.8), rgba(4,30,40,.05))" }} />
            <div style={{ position: "absolute", left: 26, bottom: 26, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(2,136,209,.92)", color: "#fff", display: "grid", placeItems: "center", fontSize: 15 }}>▶</span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 15, color: "#F2FAFF" }}>Watch Sri Lanka</span>
                <span style={{ fontSize: 12, color: "rgba(214,236,247,.6)" }}>in 60 seconds</span>
              </span>
            </div>
          </div>
          <div>
            <div className="site-eyebrow" style={{ marginBottom: 12 }}>Why travel with us</div>
            <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,46px)", lineHeight: 1.1, margin: "0 0 20px", fontWeight: 500, color: "var(--head)" }}>More Than<br />Just a Trip</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--txt)", margin: "0 0 38px", maxWidth: 470 }}>We build journeys that connect you to the heart of the island. From hidden village kitchens to iconic wonders, every moment is authentic, unhurried and yours.</p>
            <div className="grid-2" style={{ gap: "28px 32px" }}>
              {WHY_US.map((w) => (
                <div key={w.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ flex: "0 0 42px", height: 42, border: "1px solid rgba(2,136,209,.35)", borderRadius: 10, display: "grid", placeItems: "center", fontSize: 18, color: "var(--gold)" }}>{w.icon}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontSize: 14.5, color: "var(--head-2)" }}>{w.title}</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--txt-mid)" }}>{w.body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      {packages.length > 0 && (
        <section className="bgsec" style={{ padding: "96px 0" }}>
          <i className="bgl img" style={{ backgroundImage: `url('${WIKI("Nilaveli_Beach.jpg")}')` }} />
          <i className="bgl scrim" />
          <div className="site-container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 34, flexWrap: "wrap" }}>
              <div>
                <div className="site-eyebrow" style={{ marginBottom: 12 }}>Journeys made for you</div>
                <h2 className="site-h2">Featured Tour Packages</h2>
              </div>
              <Link href="/packages" style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>View all packages →</Link>
            </div>
            <div className="grid-3" style={{ gap: 22 }}>
              {packages.map((p) => (
                <HomePackageCard key={p.id} slug={p.slug} title={p.title} summary={p.summary} image={p.heroImage} days={p.days} nights={p.nights} price={p.price} dealPrice={p.dealPrice} badge={p.badge} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plan your dream getaway (offer, parallax) */}
      <section className="site-container" style={{ padding: "0 0 96px" }}>
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", minHeight: 340, display: "flex", alignItems: "center", border: "1px solid rgba(2,136,209,.2)" }}>
          <div data-parallax="0.12" style={{ position: "absolute", inset: 0, backgroundImage: `url('${WIKI("Pigeon_Island.jpg", 1800)}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(95deg, rgba(4,30,40,.95) 0%, rgba(4,30,40,.78) 45%, rgba(4,30,40,.15) 100%)" }} />
          <div style={{ position: "relative", padding: "54px 48px", maxWidth: 620 }}>
            <div className="site-eyebrow" style={{ marginBottom: 14 }}>Limited time offer</div>
            <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,44px)", lineHeight: 1.08, margin: "0 0 4px", fontWeight: 500, color: "var(--head)" }}>Plan Your Dream Getaway</h2>
            <div className="site-serif" style={{ fontStyle: "italic", fontSize: 34, color: "var(--gold-l)", marginBottom: 16 }}>Up to 20% Off</div>
            <p style={{ fontSize: 14.5, color: "var(--txt)", margin: "0 0 30px" }}>On selected tours and experiences booked before the monsoon season.</p>
            <Link href="/book" className="btn-primary">Book Now</Link>
          </div>
        </div>
      </section>

      {/* Gallery reel */}
      <section className="site-container" style={{ padding: "0 0 110px" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div className="site-eyebrow" style={{ marginBottom: 12 }}>Our gallery</div>
          <h2 className="site-h2" style={{ marginBottom: 12 }}>Captured Moments from Sri Lanka</h2>
          <p style={{ fontSize: 14.5, color: "var(--txt-mid)", margin: 0 }}>Every frame tells a story of beauty, culture and adventure.</p>
        </div>
        <GalleryReel items={gallery} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Link href="/gallery" className="btn-ghost">View all photos →</Link>
        </div>
      </section>

      {/* Journal */}
      {posts.length > 0 && (
        <section className="bgsec" style={{ padding: "96px 0" }}>
          <i className="bgl img" style={{ backgroundImage: `url('${WIKI("Sri_Lanka_Railways.jpg")}')` }} />
          <i className="bgl scrim" />
          <div className="site-container">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 34, flexWrap: "wrap" }}>
              <div>
                <div className="site-eyebrow" style={{ marginBottom: 12 }}>From the journal</div>
                <h2 className="site-h2">Stories &amp; Travel Notes</h2>
              </div>
              <Link href="/blog" style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>Read the journal →</Link>
            </div>
            <div className="grid-3" style={{ gap: 20 }}>
              {posts.map((p) => (
                <JournalCard key={p.id} slug={p.slug} title={p.title} excerpt={p.excerpt} image={p.coverImage} category={p.category} date={new Date(p.publishedAt).toLocaleDateString()} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section style={{ padding: "104px 0", background: "var(--bg-alt)" }}>
        <div className="site-container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 40, flexWrap: "wrap", rowGap: 14 }}>
            <div>
              <div className="site-eyebrow" style={{ marginBottom: 12 }}>In their words</div>
              <h2 className="site-h2">Travellers on Their Journeys</h2>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--txt-mid)", maxWidth: 340, margin: 0 }}>Written by people who travelled with us this season, unedited.</p>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} data-reveal="1" style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20, padding: "34px 30px 30px", border: "1px solid var(--bd-soft)", borderRadius: 18, background: "var(--panel)" }}>
                <span className="site-serif" style={{ position: "absolute", top: 16, right: 26, fontSize: 76, lineHeight: 1, color: "rgba(2,136,209,.22)" }}>&ldquo;</span>
                <span style={{ fontSize: 14.5, lineHeight: 1.9, color: "var(--txt)" }}>{t.text}</span>
                <span style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--bd-soft)", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 52, height: 52, borderRadius: "50%", flex: "0 0 52px", backgroundImage: `url('${t.img}')`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid rgba(2,136,209,.45)" }} />
                  <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontSize: 14.5, color: "var(--head)" }}>{t.name}</span>
                    <span style={{ fontSize: 12, color: "var(--txt-mid)" }}>{t.from}</span>
                  </span>
                </span>
                <span style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)" }}>{t.trip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
