import Link from "next/link";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import type { SiteSettings } from "@/lib/site";
import { IMG } from "@/lib/site-images";

const SocialIcon = ({ href, label, Icon }: { href: string; label: string; Icon: IconType }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="footer-social"
    style={{ width: 40, height: 40, border: "1px solid var(--bd)", borderRadius: 8, display: "grid", placeItems: "center", color: "var(--txt)" }}
  >
    <Icon size={17} aria-hidden="true" />
  </a>
);

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer style={{ position: "relative", borderTop: "1px solid var(--bd-soft)", padding: "68px 0 0", overflow: "hidden", background: "var(--bg-alt)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${IMG.hortonPlains}')`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0.35 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(4,30,40,.85) 0%, rgba(4,30,40,.7) 45%, var(--bg-alt) 100%)" }} />
      <div className="site-container" style={{ position: "relative" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr", gap: 48, paddingBottom: 52 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              {settings.logoFull || settings.logoMark ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(settings.logoFull || settings.logoMark)!} alt={settings.siteName} style={{ width: 150, maxWidth: "100%", height: "auto", display: "block" }} />
              ) : (
                <span className="site-serif" style={{ fontSize: 24, color: "var(--head)", letterSpacing: ".04em" }}>{settings.siteName}</span>
              )}
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.85, color: "var(--txt)", maxWidth: 300, margin: "0 0 20px" }}>
              Journeys that connect you with the heart and soul of Sri Lanka. Locally owned, responsibly run.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <SocialIcon href={settings.facebook || "https://facebook.com"} label="Facebook" Icon={FaFacebookF} />
              <SocialIcon href={settings.instagram || "https://instagram.com"} label="Instagram" Icon={FaInstagram} />
              <SocialIcon href={settings.youtube || "https://youtube.com"} label="YouTube" Icon={FaYoutube} />
              <SocialIcon href={settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` : "https://wa.me/94771234567"} label="WhatsApp" Icon={FaWhatsapp} />
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>Quick links</div>
            {[["/", "Home"], ["/destinations", "Destinations"], ["/categories", "Tour Categories"], ["/packages", "All Packages"], ["/gallery", "Gallery"], ["/blog", "Journal"], ["/about", "About Us"], ["/contact", "Contact"]].map(([h, l]) => (
              <Link key={l} href={h} style={{ fontSize: 13.5, color: "var(--txt)" }}>{l}</Link>
            ))}
          </div>

          {/* Top destinations */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>Top destinations</div>
            {[["sigiriya", "Sigiriya"], ["nuwara-eliya", "Nuwara Eliya"], ["mirissa", "Mirissa"], ["yala", "Yala National Park"], ["galle", "Galle"], ["ella", "Ella"]].map(([s, l]) => (
              <Link key={l} href={`/destinations/${s}`} style={{ fontSize: 13.5, color: "var(--txt)" }}>{l}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 18 }}>Newsletter</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--txt)", margin: "0 0 16px" }}>Seasonal offers and travel inspiration, once a month.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Enter your email" className="site-input" style={{ flex: 1, borderRadius: 4 }} />
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gold)", color: "#fff", display: "grid", placeItems: "center", fontSize: 15, cursor: "pointer", flexShrink: 0 }}>→</span>
            </div>
            <div style={{ marginTop: 22, fontSize: 13.5, lineHeight: 1.9, color: "var(--txt)" }}>
              {settings.phone || "+94 77 123 4567"}<br />{settings.email || "hello@ceyora.com"}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--bd-soft)", padding: "22px 0 30px", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", fontSize: 12.5, color: "var(--txt-mid)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
            <span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span>
            <span>Designed and Developed By <a href="https://www.nbcodezone.com/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-l)" }}><strong>NB CODE ZONE</strong></a>.</span>
          </div>
          <span style={{ display: "flex", gap: 24 }}><span>Privacy Policy</span><span>Terms &amp; Conditions</span></span>
        </div>
      </div>
    </footer>
  );
}
