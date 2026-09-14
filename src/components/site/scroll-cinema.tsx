"use client";

import { useEffect, useRef, useState } from "react";

interface Caption {
  /** progress (0–1) where the caption starts fading in */
  enter: number;
  /** progress where it is fully visible */
  full: number;
  /** progress where it starts fading out (omit for the final caption that should stay) */
  exit?: number;
  eyebrow?: string;
  title: React.ReactNode;
  sub?: string;
}

/**
 * Cinematic scroll section — the whole clip is tied to the whole scroll.
 *
 * Instead of frame-seeking the video (jumpy on long clips) we "chase": scroll
 * position defines a target time, and the video *plays forward* toward it,
 * speeding up to catch up and holding when you stop. So scrolling the full
 * section plays the full video start-to-finish, it stays smooth (real playback,
 * not seeking), and it can carry sound (tap to unmute). Scrolling back up seeks
 * backward (playback can't run in reverse).
 *
 * A reveal opens the footage from an inset rounded window to full-bleed as you
 * enter, and captions cross-fade across the length, ending on a held welcome.
 * Respects prefers-reduced-motion by falling back to a plain muted autoplay loop.
 */
export function ScrollCinema({
  src = "/videos/scene1-arrival.mp4",
  poster = "/site/hero.jpg",
  /** total scroll length as a multiple of the viewport height — taller = more
   *  scroll distance mapped across the clip. ~130vh per 10s of video feels good. */
  scrollVh = 520,
  captions = DEFAULT_CAPTIONS,
}: {
  src?: string;
  poster?: string;
  scrollVh?: number;
  captions?: Caption[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Sound: browsers forbid audible autoplay, so we start muted (so it can play)
  // and unmute on the very first user interaction anywhere on the page.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const enableSound = () => {
      video.muted = false;
      remove();
    };
    const remove = () => {
      ["pointerdown", "touchstart", "keydown", "click"].forEach((e) =>
        window.removeEventListener(e, enableSound),
      );
    };
    ["pointerdown", "touchstart", "keydown", "click"].forEach((e) =>
      window.addEventListener(e, enableSound, { passive: true }),
    );
    return remove;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);

    // Reduced-motion: just loop the footage muted, skip the scroll choreography.
    if (isReduced) {
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.loop = false;

    let raf = 0;
    let inView = false;
    let lastP = -1;

    const getProgress = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      return scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
    };

    const loop = () => {
      raf = inView ? requestAnimationFrame(loop) : 0;
      const p = getProgress();
      if (Math.abs(p - lastP) > 0.0004) {
        lastP = p;
        setProgress(p);
      }

      const dur = video.duration;
      if (!dur || Number.isNaN(dur)) return;

      const target = p * (dur - 0.05);
      const diff = target - video.currentTime;

      if (diff > 1.6 || diff < -0.4) {
        // Big jump (fast scroll or scrolling back up): seek directly.
        try {
          video.currentTime = target;
        } catch {
          /* not seekable yet */
        }
        if (!video.paused) video.pause();
      } else if (diff > 0.06) {
        // Behind the scroll: play forward, speeding up to catch up. Keep the
        // rate modest when audible so the sound doesn't chipmunk.
        const cap = video.muted ? 4 : 1.5;
        video.playbackRate = clamp(1 + diff, 1, cap);
        if (video.paused) video.play().catch(() => {});
      } else {
        // Caught up (or slightly ahead): hold this frame until scroll moves on.
        video.playbackRate = 1;
        if (!video.paused) video.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (!raf) raf = requestAnimationFrame(loop);
        } else {
          video.pause();
        }
      },
      { threshold: 0 },
    );
    io.observe(wrap);
    setProgress(getProgress());

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [src]);

  // Reveal: footage opens from an inset rounded window (0) to full-bleed (1)
  // across the first stretch of the scroll.
  const intro = reduced ? 1 : clamp(progress / 0.16, 0, 1);
  const inset = (1 - intro) * 6.5; // %
  const radius = (1 - intro) * 26;
  const zoom = reduced ? 1 : 1.04 + progress * 0.05; // slow push-in

  return (
    <section ref={wrapRef} className="sc-wrap" style={{ height: `${scrollVh}vh` }}>
      <div className="sc-pin">
        <div className="sc-frame" style={{ inset: `${inset}%`, borderRadius: `${radius}px` }}>
          <video
            ref={videoRef}
            className="sc-video"
            src={src}
            poster={poster}
            muted
            playsInline
            preload="auto"
            style={{ transform: `scale(${zoom.toFixed(4)})` }}
          />
          <div className="sc-vignette" />
        </div>

        {captions.map((c, i) => (
          <div
            key={i}
            className="sc-caption"
            style={{
              opacity: captionOpacity(progress, c),
              transform: `translate(-50%, -50%) translateY(${(1 - captionOpacity(progress, c)) * 22}px)`,
            }}
          >
            {c.eyebrow && <span className="sc-eyebrow">{c.eyebrow}</span>}
            <h2 className="site-serif sc-title">{c.title}</h2>
            {c.sub && <p className="sc-sub">{c.sub}</p>}
          </div>
        ))}

        {/* scroll hint, fades out once the reveal begins */}
        {!reduced && (
          <div className="sc-hint" style={{ opacity: clamp(1 - progress * 12, 0, 1) }} aria-hidden>
            <span>Scroll to enter</span>
            <span className="sc-hint-line" />
          </div>
        )}
      </div>
    </section>
  );
}

const DEFAULT_CAPTIONS: Caption[] = [
  { enter: 0.02, full: 0.1, exit: 0.28, eyebrow: "Your journey begins", title: <>Step through<br />the doors</>, sub: "A little island. A world of wonders." },
  { enter: 0.4, full: 0.5, exit: 0.66, eyebrow: "Inside the escape", title: <>Where every stay<br />feels like a story</> },
  { enter: 0.8, full: 0.9, eyebrow: "It’s time", title: <>Welcome to Ceyora</>, sub: "Let the island take it from here." },
];

function captionOpacity(p: number, c: Caption): number {
  if (p < c.enter) return 0;
  if (p < c.full) return c.full === c.enter ? 1 : (p - c.enter) / (c.full - c.enter);
  if (c.exit == null) return 1; // final caption holds
  if (p < c.exit) return 1;
  const tail = Math.min(0.12, 1 - c.exit);
  return clamp(1 - (p - c.exit) / tail, 0, 1);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
