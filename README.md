# Repro: Next.js issue #87068 — optional catch-all params empty `{}` on Edge Runtime

Next.js 15.5.7. `app/test/[[...slug]]/page.tsx` with `export const runtime = "edge"`.

```bash
npm install
npm run build && npm start   # or: npm run dev
curl -s localhost:3000/test/homepage   # params -> {}   (expected {"slug":["homepage"]})
curl -s localhost:3000/req/x/y         # params -> {"slug":["x","y"]}  (required catch-all OK on edge)
curl -s localhost:3000/dyn/42          # params -> {"id":"42"}         (dynamic OK on edge)
curl -s localhost:3000/node-test/homepage # params -> {"slug":["homepage"]} (node runtime OK)
```

Result: only optional catch-all `[[...slug]]` + edge runtime yields `{}` (dev and prod).
Fixed on next@16.3.1-canary.26 (edge runtime deprecated there but params resolve correctly).
