# Repro: vercel/next.js#73801 — intercepting route hard-navigates when deployed

Reporter repro: https://github.com/juliusmarminge/next-intercepting-routes
(`app/dashboard/[team]/[appId]/@modal/(..)audit` intercepting `/dashboard/[team]/audit`).

## Run

```bash
npm install
npm run build && npm start          # local prod server on :3000
npm run verify http://localhost:3000 local
# deployed:
npm run verify https://<your-deployment> deployed
```

`verify.mjs` (Playwright) opens `/dashboard/1/1`, clicks a card, and reports the
URL, whether the navigation stayed client-side, and whether the modal `<dialog>` rendered.

## Result on Next.js 16.3.1-canary.25 (2026-08)

Not reproducible. Local `next start` and a fresh Vercel deployment of this code both
soft-navigate to `/dashboard/1/audit?photoId=1` and render the intercepted modal
(`App layout` + `Audit modal ...` kept), and the modal close button returns to
`/dashboard/1/1`. Same result with `experimental.cacheComponents: true`
(the successor of the `experimental.ppr: true` used in the original repro; that variant
additionally needs `export const instant = false` on the dynamic pages to build).

The reporter's original deployment (built with next@15.1.1-canary.0) still shows the bug:
clicking a card issues `GET /dashboard/1/audit?photoId=1&_rsc=...` which returns
HTTP 500 (`x-matched-path: /500`), so the router falls back to a hard navigation and the
plain audit page renders instead of the modal.
