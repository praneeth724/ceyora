/**
 * Central library of the site's decorative background images.
 *
 * All optimized WebP, stored in /public/site. Reference these instead of
 * hardcoding paths or external URLs so every slot stays consistent and any
 * image can be swapped in one place.
 */
export const IMG = {
  sigiriya: "/site/story-left1.webp", // ancient rock fortress at sunrise
  teaHills: "/site/story-right.webp", // misty tea highlands
  beach: "/site/story-left.webp", // palm beach at sunset
  coastVilla: "/site/story-right1.webp", // luxury coast / villa
  train: "/site/nine-arch-train.webp", // blue train on Nine Arch Bridge
  hortonPlains: "/site/horton-plains.webp", // World's End misty highland cliff
  waterfall: "/site/waterfall.webp", // tropical jungle waterfall
  kandyTemple: "/site/kandy-temple.webp", // Temple of the Tooth at dusk
  leopard: "/site/leopard-safari.webp", // leopard in Yala
  stiltFishing: "/site/stilt-fishing.webp", // stilt fishermen at sunset
  perahera: "/site/perahera.webp", // Esala Perahera festival elephant
  galleFort: "/site/galle-fort.webp", // Galle Fort lighthouse
  nilaveli: "/site/nilaveli-beach.webp", // Nilaveli / Pigeon Island beach
} as const;

/** A sensible default background when dynamic content has no image of its own. */
export const FALLBACK_IMG = IMG.sigiriya;
