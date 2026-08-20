# Reproduction for vercel/next.js#50742 — chunk URL for `app/[param]/+` route

App Router route with a literal `+` path segment: `app/[yyyymmdd]/+/page.js` (client component).

## Steps
1. `npm install`
2. `npm run build` (webpack builder) && deploy the app to Vercel (or `npm start` locally)
3. Open `/` and click the link to `/20230607/+`

## Observed
- next@14.0.0 on Vercel: HTML/flight references
  `/_next/static/chunks/app/%5Byyyymmdd%5D/+/page-<hash>.js` (literal `+`),
  which returns 404 → `ChunkLoadError: Loading chunk 922 failed.` and React error #423.
- next canary (16.3.1-canary.25, `next build --webpack`): reference is
  `/_next/static/chunks/app/%5Byyyymmdd%5D/%2B/page-<hash>.js` → 200, page renders and hydrates.
  Default Turbopack build uses hashed chunk names and is unaffected.

To reproduce the failure, pin `"next": "14.0.0"` and use `"build": "next build"`.
