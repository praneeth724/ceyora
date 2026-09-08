import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/site";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { href: settings.facebook, label: "Facebook" },
    { href: settings.instagram, label: "Instagram" },
    { href: settings.twitter, label: "Twitter" },
    { href: settings.youtube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <footer
      style={{
        marginTop: 80,
        borderTop: "1px solid var(--bd-soft)",
        background: "var(--bg-alt)",
      }}
    >
      <div className="site-container" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div
          style={{
            display: "grid",
            gap: 32,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <p className="site-serif" style={{ fontSize: 22, color: "var(--head)", margin: 0 }}>
              {settings.siteName}
            </p>
            {settings.tagline && (
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--txt-mid)" }}>{settings.tagline}</p>
            )}
            {socials.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "7px 14px",
                      borderRadius: 999,
                      border: "1px solid var(--bd)",
                      color: "var(--gold-l)",
                      fontSize: 12,
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--txt-faint)", marginBottom: 14 }}>
              Explore
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li><Link href="/packages">Tour Packages</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/destinations">Destinations</Link></li>
              <li><Link href="/blog">Journal</Link></li>
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--txt-faint)", marginBottom: 14 }}>
              Company
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, fontSize: 14 }}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/book">Book a Trip</Link></li>
            </ul>
          </div>

          <div>
            <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--txt-faint)", marginBottom: 14 }}>
              Get in touch
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12, fontSize: 14 }}>
              {settings.email && (
                <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Mail size={15} /> <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
              )}
              {settings.phone && (
                <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Phone size={15} /> <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                </li>
              )}
              {settings.address && (
                <li style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <MapPin size={15} /> {settings.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid var(--bd-soft)",
            fontSize: 12.5,
            color: "var(--txt-faint)",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
