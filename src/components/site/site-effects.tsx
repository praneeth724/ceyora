"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global scroll effects for the public site:
 *  - reveal-on-scroll for [data-reveal] elements
 *  - parallax translate for [data-parallax] elements (attr value = speed)
 * Re-scans on every route change so client-side navigations pick up new nodes.
 */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal on scroll (re-query after the new page has painted).
    let observer: IntersectionObserver | null = null;
    const revealTimer = window.setTimeout(() => {
      const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
      if (!revealEls.length) return;
      if (prefersReduced) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
      );
      revealEls.forEach((el) => observer!.observe(el));
      // Safety net: reveal anything still hidden after 1.2s (e.g. if it never intersects).
      window.setTimeout(() => revealEls.forEach((el) => el.classList.add("is-visible")), 1200);
    }, 60);

    // Parallax
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let raf = 0;
    function onScroll() {
      if (prefersReduced) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        parallaxEls.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || "0.15");
          const rect = el.getBoundingClientRect();
          const offset = rect.top + rect.height / 2 - vh / 2;
          el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
        });
        raf = 0;
      });
    }
    if (parallaxEls.length && !prefersReduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }

    return () => {
      window.clearTimeout(revealTimer);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
