# Repro: vercel/next.js#50215 — `loading.tsx` / Suspense fallback never streams for statically-cached (ISR) routes

Verified on `next@16.3.1-canary.25`.

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3000
```

- `/normal/[slug]` — `dynamic = 'force-dynamic'`, 5s await → `loading.jsx` streams immediately.
- `/bugged/[slug]` — `generateStaticParams` + `revalidate = 30` (ISR), same 5s await → response is
  fully buffered; no loading fallback, no streaming.

## Observed (production `next start`)

| request | time to first byte | loading fallback streamed |
| --- | --- | --- |
| `GET /normal/test` (dynamic) | 21ms | yes, content at 5021ms |
| `GET /bugged/s7` (ISR, `x-nextjs-cache: MISS`) | 5026ms | no — single 6KB chunk |
| client-side `<Link prefetch={false}>` → `/bugged/s1` (uncached) | — | no fallback, blank for 5.1s |

The on-demand ISR render is generated with a full (non-streaming) prerender, so the Suspense
boundary above the segment is resolved on the server before anything is sent.
