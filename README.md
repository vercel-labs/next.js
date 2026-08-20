# Repro probe for vercel/next.js#60477

"Next.js default not-found/404 page doesn't render on Vercel deployments"

The reporter's CodeSandbox devbox (`dry-dust-r83nds`) is not reachable
(403 on codesandbox.io, 503 on the `*-3000.csb.app` preview), so its
`next.config.js` (referenced in the issue link) could not be inspected.
This is the minimal equivalent app described in the issue:

- `app/page.js` – home page ("HOME PAGE")
- `app/not-found.js` – custom root not-found ("CUSTOM NOT FOUND PAGE")
- `app/[slug]/page.js` – dynamic route with `generateStaticParams()` + `notFound()`

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
./check.sh http://localhost:3000
```

Deploy the same directory to Vercel and run `./check.sh <deployment-url>`.

## Result (does NOT reproduce)

Local dev, local `next start`, and Vercel deployments all return
HTTP 404 + the custom not-found page for `/nosuchpage` and `/a/b`.
Verified on Vercel with next `14.0.4`, `14.2.25` and `16.3.1`.

A `next.config.js` with a catch-all `fallback` rewrite to `/` was also
tried: it serves the home page for unmatched multi-segment paths, but
identically in dev, `next start`, and on Vercel (no dev/Vercel mismatch).
