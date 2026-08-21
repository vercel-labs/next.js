# Repro: issue #95567 — App Router navigation waits for the RSC tree before updating UI

Next.js 16.2.9 (also verified on 16.3.1 with `cacheComponents`+`partialPrefetching`).

## Run
```
npm install
npm run build
npm start
# open http://localhost:3000 and click "slow" then "slowloading"
```

Optional automated measurement (Playwright): `node measure.mjs`

## Routes
- `/slow` — dynamic, 3s server render, **no `loading.js`**
- `/slow-with-loading` — same, but with `loading.js`

## Observed (production server, no prefetch)
| click | URL / `usePathname()` at 400ms | UI at 400ms | settled |
|---|---|---|---|
| `/slow` | still `/` | old Home page still on screen | 3.27s |
| `/slow-with-loading` | `/slow-with-loading` | `Loading…` fallback | 3.27s |

So the URL, active-link state and content only swap after the RSC payload arrives when the
target segment has no Suspense/`loading.js` boundary.
