"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/site";
// import { ThemeToggle } from "./theme"; // dark/light toggle hidden for now (light-only)
import { LangSwitcher } from "./lang-switcher";
import type { Dict, Locale } from "@/lib/i18n";

export function Navbar({
  settings,
  locale,
  dict,
}: {
  settings: SiteSettings;
  locale: Locale;
  dict: Dict["nav"];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const LINKS = [
    { href: "/", label: dict.home },
    { href: "/destinations", label: dict.destinations },
    { href: "/categories", label: dict.categories },
    { href: "/packages", label: dict.packages },
    { href: "/gallery", label: dict.gallery },
    { href: "/blog", label: dict.journal },
    { href: "/about", label: dict.about },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "sticky",
        top: 12,
        zIndex: 60,
        maxWidth: 1280,
        margin: "12px auto 0",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "8px 12px 8px 16px",
          background: "var(--nav-bg)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          border: "1px solid var(--bd-soft)",
          borderRadius: 20,
          boxShadow: "0 16px 44px rgba(2,12,18,.38)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {settings.logoMark || settings.logoFull ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={(settings.logoFull || settings.logoMark)!}
              alt={settings.siteName}
              style={{ height: 40, width: "auto", display: "block" }}
            />
          ) : (
            <span
              style={{
                display: "grid",
                placeItems: "center",
                height: 40,
                width: 40,
                borderRadius: 12,
                background: "var(--gold)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {settings.siteName.charAt(0)}
            </span>
          )}
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <strong
              className="site-serif"
              style={{ color: "var(--head)", fontSize: 16, letterSpacing: ".04em" }}
            >
              {settings.siteName}
            </strong>
            {settings.tagline && (
              <small style={{ color: "var(--txt-mid)", fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase" }}>
                {settings.tagline}
              </small>
            )}
          </span>
        </Link>

        <nav className="site-desktop-nav" style={{ marginLeft: "auto", display: "flex", gap: 26, fontSize: 13 }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ color: isActive(l.href) ? "var(--gold-l)" : "var(--txt)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LangSwitcher locale={locale} />
          <Link href="/contact" className="btn-ghost" style={{ padding: "10px 18px" }}>
            {dict.planTrip} ↗
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="site-burger"
          style={{
            marginLeft: "auto",
            display: "none",
            width: 44,
            height: 44,
            border: "1px solid var(--bd)",
            borderRadius: 12,
            color: "var(--head)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="site-mobile-menu"
          style={{
            marginTop: 8,
            background: "var(--panel-2)",
            border: "1px solid var(--bd-soft)",
            borderRadius: 18,
            padding: "10px 20px 20px",
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "14px 4px",
                fontSize: 15,
                color: "var(--txt)",
                borderBottom: "1px solid var(--bd-soft)",
              }}
            >
              {l.label}
              <span style={{ color: "var(--gold)" }}>→</span>
            </Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <div style={{ flex: 1, display: "flex" }}>
              <LangSwitcher locale={locale} block />
            </div>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              {dict.planTrip}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
