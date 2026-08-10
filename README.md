# Repro: vercel/next.js#97036

Client navigation commits into a Suspense fallback that never resolves
(`cacheComponents: true`, App Router, zero in-flight network, reload-only recovery).

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # production server on :3000
node repro.mjs         # deterministic Playwright driver, exits 1 when reproduced
```

## What the app is

`app/[locale]/(signedin)/{a,b,c}` — a `[locale]` dynamic root segment (locale rewritten
in `proxy.ts`, next-intl `localePrefix: 'never'` style), a synchronous static shell, and a
per-section layout whose app chrome (`NavRail`) reads `cookies()`/`headers()` inside a
`<Suspense>` boundary, so it re-suspends (~0.3–1.5s) on every top-level navigation.

## Sequence (deterministic, 100% of rounds)

Per round: click **B** → after 250ms (while B's chrome is still suspended) click **C** →
`history.back()` → `history.forward()`.

## Observed

Each round leaks exactly one additional **visible** `SKELETON / spinner` fallback that
never resolves. They accumulate (1, 2, 3, 4, 5 …), survive 20s+ of idle with **0**
in-flight requests, and only a full reload clears them.

Requires the interrupted navigation **and** the `back` + `forward` restore; settled
navigations with back/forward, or interrupts without history restore, do not leak.

## Matrix (5 rounds each, production build, Playwright/Chromium)

| Config | Result |
| --- | --- |
| next 16.3.0, `cacheComponents: true` | 4 stuck fallbacks, 0 in-flight |
| next 16.3.1-canary.10, `cacheComponents: true` | 4 stuck fallbacks, 0 in-flight |
| next 16.3.0, `cacheComponents: true`, no `partialPrefetching` | 5 stuck fallbacks, 0 in-flight |
| next 16.3.0, `cacheComponents: false` | no stuck fallbacks (PASS) |

With `cacheComponents: false` the router keeps a single layout shell (`shells: 1`);
with it enabled the DOM holds the visible shell plus hidden (`display: none`)
`<Activity>` bfcache shells, and the interrupted-then-restored entry stays in its
fallback forever.
