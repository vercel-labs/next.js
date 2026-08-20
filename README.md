# Repro: next#72807 — Pages Router + middleware on Vercel: 404 data request returns 200

Minimal Pages Router app (Next.js 15.5.23):

- `pages/[...slug].js` uses `getStaticPaths` with `fallback: false` and only pre-renders `/hello`,
  so every other path must 404.
- `middleware.js` exists but its matcher (`/restricted/:path*`) does NOT match the tested routes.
- `pages/index.js` has `<Link href="/noop">`, which next/link prefetches.

## Reproduce

```bash
npm install
npm run build           # local (works correctly: 404)
vercel deploy --prod    # or import this directory in Vercel
node verify.mjs <deployment-url> shot.png
```

## Observed on Vercel (with middleware)

`GET /_next/data/<buildId>/noop.json` → **200** with body `{}`
(`x-matched-path: /__next_data_catchall`, `x-nextjs-matched-path: /noop`).
Client-side navigation renders the `[...slug]` page with `undefined` props instead of the 404 page.

Direct (non-client) navigation to `/noop` correctly returns 404.

## Control (delete `middleware.js` and redeploy)

`GET /_next/data/<buildId>/noop.json` → **404**, and clicking the link renders
`404: This page could not be found`.
