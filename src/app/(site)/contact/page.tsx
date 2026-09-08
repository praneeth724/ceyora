import { getSiteSettings } from "@/lib/site";
import { ContactForm } from "@/components/site/contact-form";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSiteSettings();
  const cards = [
    { icon: "☎", label: "Call us", value: s.phone || "+94 77 123 4567" },
    { icon: "✉", label: "Email", value: s.email || "hello@ceyora.com" },
    { icon: "◎", label: "Office", value: s.address || "No. 123, Galle Road, Colombo 03" },
    { icon: "◷", label: "Hours", value: "Mon–Sat, 8.30am – 6.30pm (GMT+5:30)" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="site-container" style={{ padding: "120px 0 48px", textAlign: "center" }}>
        <div className="site-eyebrow" style={{ marginBottom: 14 }}>Get in touch</div>
        <h1 className="site-serif" style={{ fontSize: "clamp(36px,5.5vw,58px)", margin: "0 0 14px", fontWeight: 500, color: "var(--head)" }}>Let&apos;s Plan Your Journey</h1>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--txt-mid)", maxWidth: 560, margin: "0 auto" }}>Tell us where you&apos;d like to go and how you like to travel. A local expert replies within one working day.</p>
      </section>

      {/* Contact cards */}
      <section className="site-container" style={{ padding: "0 0 40px" }}>
        <div className="grid-4" style={{ gap: 16 }}>
          {cards.map((c) => (
            <div key={c.label} style={{ padding: 26, border: "1px solid var(--bd-soft)", borderRadius: 14, background: "var(--panel)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontSize: 20, color: "var(--gold)" }}>{c.icon}</span>
              <span style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--txt-faint)" }}>{c.label}</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--head-2)" }}>{c.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form + map */}
      <section className="site-container" style={{ padding: "0 0 110px" }}>
        <div className="grid-2" style={{ gap: 24, alignItems: "stretch" }}>
          <div style={{ border: "1px solid var(--bd-soft)", borderRadius: 16, background: "var(--panel)", padding: 38 }}>
            <h2 className="site-serif" style={{ fontSize: 30, margin: "0 0 24px", fontWeight: 500, color: "var(--head)" }}>Send an inquiry</h2>
            <ContactForm />
          </div>
          <div style={{ border: "1px solid var(--bd-soft)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--panel)" }}>
            <iframe
              title="Office location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=79.8200%2C6.9000%2C79.9000%2C6.9600&layer=mapnik&marker=6.9300%2C79.8600"
              style={{ width: "100%", flex: 1, minHeight: 420, border: 0, filter: "grayscale(.35) contrast(1.05) brightness(.85)" }}
            />
            <div style={{ padding: 26, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, borderTop: "1px solid var(--bd-soft)" }}>
              <div>
                <div style={{ fontSize: 11.5, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>Colombo office</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--txt)" }}>{s.address || "No. 123, Galle Road, Colombo 03, Sri Lanka"}</div>
              </div>
              <a href="https://www.openstreetmap.org/?mlat=6.93&mlon=79.86#map=14/6.93/79.86" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ whiteSpace: "nowrap" }}>Directions</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
