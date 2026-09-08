"use client";

import Link from "next/link";
import { useRef } from "react";

export interface ReelItem {
  img: string;
  caption: string;
  href?: string;
}

export function GalleryReel({ items }: { items: ReelItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: number) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <div className="gallery-reel">
      <div className="reel-toolbar">
        <p>Little moments. Lasting memories. Swipe to explore.</p>
        <div className="reel-controls">
          <button aria-label="Scroll left" onClick={() => scrollBy(-1)}>‹</button>
          <button aria-label="Scroll right" onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>
      <div className="photo-reel" ref={ref} role="region" aria-label="Photo reel">
        {items.map((g, i) => {
          const inner = (
            <>
              <span className="postcard-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.caption} loading="lazy" />
              </span>
              <span className="postcard-caption">
                {g.caption}
                <small>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </small>
              </span>
            </>
          );
          return g.href ? (
            <Link key={i} href={g.href} className="photo-postcard">
              {inner}
            </Link>
          ) : (
            <div key={i} className="photo-postcard">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
