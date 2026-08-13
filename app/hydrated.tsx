"use client";
import { useEffect } from "react";
export function HydrationMarker() {
  useEffect(() => {
    (window as any).__hydrated = true;
    console.log("[client] hydrated at", Math.round(performance.now()), "ms");
  }, []);
  return null;
}
