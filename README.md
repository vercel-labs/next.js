# Repro: CSS Modules break selective hydration (FOUC) — vercel/next.js#77239

A `React.lazy` component (resolved after a 5s delay) inside `<Suspense>` imports a CSS Module.
The component IS server-rendered (its hashed class name is in the HTML), but its stylesheet is
NOT referenced by the initial document — it is only fetched when the lazy client chunk loads,
so the content is unstyled for ~5s (FOUC).

Routes:
- `/` — Pages Router
- `/app-demo` — App Router

## Run

```bash
npm install
npm run build
npm run start
# then open http://localhost:3000/ and http://localhost:3000/app-demo
```

Observed with next@16.3.1-canary.26 + react@19 (Turbopack build): initial
`getComputedStyle(#footer).color === rgb(0,0,0)`, no `link[rel=stylesheet]` in the document,
and the CSS chunk is requested only at ~5.1s, after which the color becomes `rgb(255,0,0)`.
