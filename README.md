# Repro: next.js#67538 — client components inside `app/loading.tsx` never mount on initial load (Lottie animation invisible)

Minimal reproduction for https://github.com/vercel/next.js/issues/67538.

`app/loading.tsx` renders a `'use client'` component (`components/loader.tsx`) that starts a
`lottie-react` animation in an effect and also logs/renders whether its `useEffect` ran.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
# open http://localhost:3000  (page.tsx awaits 5s so the loading fallback is streamed)
```

## Observed (next@16.3.1-canary.25, react@19.2.8; dev and prod)

* Hard load / reload of `/`: fallback HTML is visible but shows `EFFECT_DID_NOT_RUN`,
  `LOADER_EFFECT_RAN` is never logged, and `#lottie-host` contains **0** `<svg>` elements —
  the Lottie animation never appears.
* Client-side navigation to `/slow` (click the link): the same fallback shows `EFFECT_RAN`,
  one `<svg>` exists and its transform changes between frames — the animation plays.

So client components used as a Suspense/`loading.tsx` fallback are streamed as inert SSR HTML and
are never hydrated/mounted, so effect-driven UI (Lottie, canvas, video, IntersectionObserver, …)
does not run until the boundary resolves.
