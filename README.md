# Repro: fetch cache seeded at build time (SSG) is not reused at runtime on Vercel

Original issue: https://github.com/vercel/next.js/issues/62649

`/u/[id]` prerenders ids 1,2,3 at build time. All of them share one `force-cache`
fetch (revalidate 3600) to a time API, so every prerendered page shows the same
timestamp. Requesting a non-prerendered id (`/u/5`) at runtime should reuse the
fetch cache entry seeded during the build.

## Run

```bash
npm install
npm run build
npm start
curl -s localhost:3000/u/3 | grep -o '"timestamp[^<]*'
curl -s localhost:3000/u/5 | grep -o '"timestamp[^<]*'   # same locally
```

Locally the timestamps match (`.next/cache/fetch-cache` is reused). Deployed on
Vercel, `/u/5` shows a fresh timestamp -> build-time fetch cache is not reused.

## Observed on Vercel (Next 16.3.1-canary.25)

| path | x-vercel-cache | fetched timestamp |
| --- | --- | --- |
| /u/1,2,3 (prerendered) | PRERENDER | 2026-08-20T20:35:33.092Z |
| /u/5 (runtime ISR) | MISS | 2026-08-20T20:35:44.379Z |
| /u/7 (runtime ISR) | MISS | 2026-08-20T20:35:44.379Z |

`/u/5` re-fetched only ~11s after the build even though `revalidate: 3600`, so the
build-time fetch cache entry was not reused; `/u/7` then reuses the runtime entry.
