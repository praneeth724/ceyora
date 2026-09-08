"use client";

import dynamic from "next/dynamic";
import type { RouteStop } from "./route-map";

const RouteMap = dynamic(() => import("./route-map"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 480, borderRadius: 16, background: "var(--panel)", border: "1px solid var(--bd-soft)" }} />
  ),
});

export function RouteMapLoader({ stops }: { stops: RouteStop[] }) {
  return <RouteMap stops={stops} />;
}
