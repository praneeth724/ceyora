/**
 * StorySplit — a "two worlds meet in the middle" story band.
 *
 * Technique (ported from the split-background hero pattern): two background
 * layers are each pinned to one half of the section and masked with a linear
 * gradient so each image is solid at the outer edge and fades to transparent
 * toward the centre. The section's own background colour shows through that
 * transparent centre, so the two images appear to melt into a soft merge band
 * where the headline and emblem sit. A centre overlay adds a gentle glow.
 *
 * Fully CSS-driven and theme-aware (the merge band follows `--bg`, so it works
 * in both light and dark mode). Drop two images at the given paths and go.
 */

interface Feature {
  title: string;
  body: string;
}

export function StorySplit({
  eyebrow = "Our story",
  leftLabel = "Timeless Island",
  rightLabel = "Effortless Journey",
  titleTop = "Timeless Island.",
  titleBottom = "Effortless Journey.",
  subtitle = "Every detail planned. Every moment yours.",
  leftImage = "/site/story-left1.webp",
  rightImage = "/site/story-right1.webp",
  leftFeatures = LEFT_FEATURES,
  rightFeatures = RIGHT_FEATURES,
}: {
  eyebrow?: string;
  leftLabel?: string;
  rightLabel?: string;
  titleTop?: string;
  titleBottom?: string;
  subtitle?: string;
  leftImage?: string;
  rightImage?: string;
  leftFeatures?: Feature[];
  rightFeatures?: Feature[];
}) {
  return (
    <section className="story-split">
      {/* layered, masked backgrounds */}
      <div className="ss-bg" aria-hidden>
        <div className="ss-panel left" style={{ backgroundImage: `url('${leftImage}')` }} />
        <div className="ss-panel right" style={{ backgroundImage: `url('${rightImage}')` }} />
        <div className="ss-merge" />
        <div className="ss-glow" />
      </div>

      <div className="site-container ss-inner">
        <header className="ss-head" data-reveal="1">
          <div className="site-eyebrow ss-eyebrow">
            <span className="ss-rule" />
            {eyebrow}
            <span className="ss-rule" />
          </div>
          <h2 className="site-serif ss-title">
            <span className="ss-line-1">{titleTop}</span>
            <span className="ss-line-2">{titleBottom}</span>
          </h2>
          <p className="ss-sub">{subtitle}</p>
          <span className="ss-emblem" aria-hidden>
            <span className="ss-emblem-ring" />
            <span className="ss-emblem-ring ss-emblem-ring-2" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ss-emblem-logo" src="/site/logo-mark.png" alt="" />
          </span>
        </header>

        <div className="ss-columns">
          <div className="ss-col ss-col-left" data-reveal="1">
            <div className="ss-col-label">{leftLabel}</div>
            {leftFeatures.map((f) => (
              <div key={f.title} className="ss-feature">
                <span className="ss-dot" />
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.body}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="ss-col ss-col-right" data-reveal="1">
            <div className="ss-col-label">{rightLabel}</div>
            {rightFeatures.map((f) => (
              <div key={f.title} className="ss-feature">
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.body}</span>
                </div>
                <span className="ss-dot" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const LEFT_FEATURES: Feature[] = [
  { title: "Ancient Heritage", body: "Rock fortresses, sacred cities and centuries of story." },
  { title: "Wild Landscapes", body: "Misty tea hills, leopard country and endless coast." },
  { title: "Living Culture", body: "Temples, markets and the rhythm of island life." },
  { title: "Sacred Nature", body: "Waterfalls, rainforest and the quiet of the highlands." },
];

const RIGHT_FEATURES: Feature[] = [
  { title: "Handpicked Stays", body: "Boutique hotels and hideaways we know and trust." },
  { title: "Private Guides", body: "Local experts who open doors you'd never find alone." },
  { title: "Seamless Travel", body: "Private drivers, planned routes, zero friction." },
  { title: "Personal Care", body: "A friendly team beside you from arrival to farewell." },
];
