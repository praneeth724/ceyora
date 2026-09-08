import { getSiteSettings } from "@/lib/site";
import { PageBanner } from "@/components/site/page-banner";
import { ContactForm } from "@/components/site/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSiteSettings();
  const items = [
    s.email && { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    s.phone && { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone}` },
    s.address && { icon: MapPin, label: "Address", value: s.address },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageBanner
        eyebrow="We'd love to hear from you"
        title="Get in Touch"
        subtitle="Have a question or ready to plan your trip? Send us a message and our team will respond soon."
      />
      <section className="site-container site-detail-grid" style={{ paddingTop: 48 }}>
        <div style={{ minWidth: 0 }}>
          <ContactForm />
        </div>
        <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.label} style={{ display: "flex", gap: 14, padding: 18, borderRadius: 14, border: "1px solid var(--bd-soft)", background: "var(--panel)" }}>
                <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 10, background: "rgba(2,136,209,.15)", color: "var(--gold-l)", display: "grid", placeItems: "center" }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--txt-faint)", margin: 0 }}>{it.label}</p>
                  {it.href ? (
                    <a href={it.href} style={{ color: "var(--head)", fontSize: 15 }}>{it.value}</a>
                  ) : (
                    <p style={{ color: "var(--head)", fontSize: 15, margin: "2px 0 0" }}>{it.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </aside>
      </section>
    </>
  );
}
