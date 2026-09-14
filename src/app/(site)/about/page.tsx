import Link from "next/link";
import { getSiteSettings } from "@/lib/site";

export const metadata = { title: "About Us" };

const W = (n: string, w = 1400) => `https://commons.wikimedia.org/wiki/Special:FilePath/${n}?width=${w}`;

const ABOUT_STRIP = [
  { img: W("Worlds_End_Sri_Lanka.jpg", 900), caption: "Guiding at World's End" },
  { img: W("Kandy_Lake.jpg", 900), caption: "Kandy, our second office" },
  { img: W("Ravana_Falls.jpg", 900), caption: "Waterfall stops, unplanned" },
  { img: W("Nilaveli_Beach.jpg", 900), caption: "East coast, low season" },
  { img: W("Dambulla_cave_temple.jpg", 900), caption: "Dambulla with our guides" },
  { img: W("Adams_Peak.jpg", 900), caption: "Adam's Peak pilgrimage" },
];

const ESSENCE = [
  { icon: "❧", title: "Authentic", body: "Real places, real people, no staged photo stops." },
  { icon: "△", title: "Breathtaking", body: "Timed so you see the island at its best light." },
  { icon: "♡", title: "Welcoming", body: "Hospitality that starts before you land." },
  { icon: "◎", title: "Sustainable", body: "Local ownership and low-impact travel by default." },
];

export default async function AboutPage() {
  const s = await getSiteSettings();

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", height: 420, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div data-parallax="0.12" style={{ position: "absolute", inset: 0, backgroundImage: `url('${W("Horton_Plains.jpg", 1800)}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,30,40,.96), rgba(4,30,40,.5))" }} />
        <div className="site-container" style={{ position: "relative", width: "100%" }}>
          <div className="site-eyebrow" style={{ marginBottom: 14 }}>About us</div>
          <h1 className="site-serif" style={{ fontSize: "clamp(38px,6vw,60px)", lineHeight: 1.02, margin: "0 0 6px", fontWeight: 500, color: "#F2FAFF" }}>Local Hearts,</h1>
          <div className="site-serif" style={{ fontStyle: "italic", fontSize: "clamp(30px,4.5vw,46px)", color: "var(--gold-l)" }}>Global Standards</div>
        </div>
      </section>

      {/* Our story */}
      <section className="site-container" style={{ padding: "96px 0" }}>
        <div className="grid-2" style={{ gap: 64, alignItems: "center" }}>
          <div>
            <div className="site-eyebrow" style={{ marginBottom: 14 }}>Our story</div>
            <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,44px)", lineHeight: 1.1, margin: "0 0 22px", fontWeight: 500, color: "var(--head)" }}>Born on this island, built for travellers</h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--txt)", margin: "0 0 18px" }}>
              {s.siteName} began with three friends, one van and a belief that the best way to see Sri Lanka is through the people who call it home. Twelve years later we are a team of guides, drivers, naturalists and planners spread across the island.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: "var(--txt-mid)", margin: "0 0 32px" }}>
              We keep our groups small, our itineraries flexible and our partners local. Every stay, every meal and every guide is chosen because we would send our own family there.
            </p>
            <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
              {[["12", "Years guiding"], ["8,400", "Happy travellers"], ["40+", "Guides & drivers"]].map(([n, l]) => (
                <div key={l}>
                  <div className="site-serif" style={{ fontSize: 38, color: "var(--gold)" }}>{n}</div>
                  <div style={{ fontSize: 12.5, color: "var(--txt-mid)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "210px 210px", gap: 14 }}>
            <div style={{ borderRadius: 14, backgroundImage: `url('${W("Sri_Lanka_tea_plantation.jpg", 900)}')`, backgroundSize: "cover", backgroundPosition: "center", gridRow: "span 2" }} />
            <div style={{ borderRadius: 14, backgroundImage: `url('${W("Esala_Perahera.jpg", 900)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ borderRadius: 14, backgroundImage: `url('${W("Stilt_fishing.jpg", 900)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
      </section>

      {/* Quote band — fixed-background parallax (image pinned, content scrolls over) */}
      <section className="parallax-band" style={{ minHeight: 520, display: "flex", alignItems: "center", marginBottom: 96, backgroundImage: `url('${W("Diyaluma_Falls.jpg", 1920)}')` }}>
        <span className="parallax-scrim" style={{ background: "linear-gradient(90deg, rgba(4,30,40,.92), rgba(4,30,40,.45) 70%, rgba(4,30,40,.7))" }} />
        <div className="site-container parallax-inner" style={{ width: "100%" }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "#0288D1", marginBottom: 18 }}>Our island, our office</div>
            <blockquote className="site-serif" style={{ margin: 0, fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.32, color: "#F2FAFF", fontStyle: "italic" }}>
              &ldquo;We do not sell Sri Lanka. We introduce you to it, and then get out of the way.&rdquo;
            </blockquote>
            <div style={{ marginTop: 26, fontSize: 13, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(214,236,247,.7)" }}>Ruwan Perera · Head of guiding</div>
          </div>
        </div>
      </section>

      {/* Days on the road */}
      <section className="site-container" style={{ padding: "0 0 96px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 26, flexWrap: "wrap" }}>
          <div>
            <div className="site-eyebrow" style={{ marginBottom: 12 }}>Behind the trips</div>
            <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,44px)", margin: 0, fontWeight: 500, color: "var(--head)" }}>Days on the Road</h2>
          </div>
          <Link href="/gallery" style={{ color: "var(--gold-l)", fontSize: 12.5, letterSpacing: ".1em", textTransform: "uppercase" }}>See the gallery →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }} className="about-strip">
          {ABOUT_STRIP.map((s2) => (
            <div key={s2.caption} style={{ position: "relative", height: 260, borderRadius: 14, overflow: "hidden", border: "1px solid var(--bd-soft)" }}>
              <span style={{ position: "absolute", inset: 0, backgroundImage: `url('${s2.img}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(4,30,40,.9) 4%, rgba(4,30,40,.05) 55%)" }} />
              <span style={{ position: "absolute", left: 14, right: 14, bottom: 14, fontSize: 12.5, lineHeight: 1.5, color: "rgba(244,251,255,.92)" }}>{s2.caption}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brand essence */}
      <section className="site-container" style={{ padding: "0 0 96px" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <div className="site-eyebrow" style={{ marginBottom: 12 }}>What guides us</div>
          <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,44px)", margin: 0, fontWeight: 500, color: "var(--head)" }}>Brand Essence</h2>
        </div>
        <div className="grid-4" style={{ gap: 18 }}>
          {ESSENCE.map((e) => (
            <div key={e.title} style={{ padding: "32px 26px", border: "1px solid var(--bd-soft)", borderRadius: 16, background: "var(--panel)" }}>
              <div style={{ fontSize: 26, color: "var(--gold)", marginBottom: 16 }}>{e.icon}</div>
              <div className="site-serif" style={{ fontSize: 23, color: "var(--head)", marginBottom: 10 }}>{e.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--txt-mid)" }}>{e.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="site-container" style={{ padding: "0 0 110px" }}>
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", padding: "80px 48px", textAlign: "center", border: "1px solid rgba(2,136,209,.2)" }}>
          <div data-parallax="0.12" style={{ position: "absolute", inset: 0, backgroundImage: `url('${W("Unawatuna_beach.jpg", 1800)}')`, backgroundSize: "cover", backgroundPosition: "center", willChange: "transform" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(4,30,40,.82)" }} />
          <div style={{ position: "relative" }}>
            <h2 className="site-serif" style={{ fontSize: "clamp(30px,4vw,46px)", margin: "0 0 4px", fontWeight: 500, color: "#F2FAFF" }}>Ready to explore Sri Lanka?</h2>
            <p style={{ fontSize: 15, color: "rgba(214,236,247,.8)", margin: "0 0 30px" }}>Let&apos;s plan your unforgettable journey with local experts.</p>
            <Link href="/contact" className="btn-primary">Plan Your Trip →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
