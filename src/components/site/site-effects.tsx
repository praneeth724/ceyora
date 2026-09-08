"use client";

import { useEffect } from "react";

/**
 * Global scroll effects for the public site:
 *  - reveal-on-scroll for [data-reveal] elements
 *  - parallax translate for [data-parallax] elements (attr value = speed)
 * Mounted once in the site layout.
 */
export function SiteEffects() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    let observer: IntersectionObserver | null = null;
    if (revealEls.length) {
      if (prefersReduced) {
        revealEls.forEach((el) => el.classList.add("is-visible"));
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                (entry.target as HTMLElement).classList.add("is-visible");
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 },
        );
        revealEls.forEach((el) => observer!.observe(el));
      }
    }

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
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
