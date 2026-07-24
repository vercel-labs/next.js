"use client";

import { useEffect } from "react";

// Sustained prefetch pressure — a faithful, steady stand-in for what a real
// dashboard does on a slow runner. There, the RSC pipe is busy the whole time an
// interaction happens: sidebar links prefetch on viewport/hover, the router
// revalidates, more links scroll into view. On a fast dev machine that pressure
// comes and goes in a blink, so the pool never stays full long enough to see the
// bug. This component keeps a handful of real `_rsc` prefetches in flight for a
// short window — the exact same GETs the sidebar's <Link>s issue, just kept topped
// up — so Chrome's 6 HTTP/1.1 sockets stay occupied while the Server Action is
// clicked. Over HTTP/2 these would multiplex and it would have no effect at all,
// which is precisely the point: the failure is a property of the HTTP/1.1 pool.
//
// It only issues GETs the app already serves; it mutates nothing. The repro script
// disables it (concurrency 0) for the HTTP/2-equivalent control run.
const CONCURRENCY = Number(process.env.NEXT_PUBLIC_PRESSURE_CONCURRENCY ?? 8);
const DURATION_MS = Number(process.env.NEXT_PUBLIC_PRESSURE_MS ?? 18000);
const LINKS = Number(process.env.NEXT_PUBLIC_PRESSURE_LINKS ?? 60);

declare global {
  interface Window {
    // The Playwright control run sets this to 0 to disable pressure.
    __PRESSURE_CONCURRENCY__?: number;
  }
}

export function PrefetchPressure() {
  useEffect(() => {
    const concurrency =
      typeof window.__PRESSURE_CONCURRENCY__ === "number" ? window.__PRESSURE_CONCURRENCY__ : CONCURRENCY;
    if (concurrency <= 0) return; // control run: no pressure (stands in for HTTP/2)

    let stopped = false;
    const until = Date.now() + DURATION_MS;
    const fire = () => {
      if (stopped || Date.now() > until) return;
      const id = 1 + Math.floor(Math.random() * LINKS);
      // Unique `_rsc` value so nothing is served from cache — a genuine round trip
      // the proxy holds, occupying one of the six sockets.
      fetch(`/item/${id}?_rsc=pressure-${Date.now()}-${Math.random().toString(36).slice(2)}`, {
        priority: "low", // exactly like a real router prefetch
        headers: { RSC: "1", "Next-Router-Prefetch": "1" },
      })
        .catch(() => {})
        .finally(() => {
          if (!stopped) fire(); // keep the slot full
        });
    };

    for (let i = 0; i < concurrency; i++) fire();
    return () => {
      stopped = true;
    };
  }, []);

  return null;
}
