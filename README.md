# Repro: Anchor links include rewritten path prefix in Pages Router (#77394)

Middleware rewrites `/` -> `/en`. The page `pages/en/index.js` renders `<Link href="#about">`.

Expected rendered HTML: `href="#about"` (App Router behavior).
Actual (Pages Router): `href="/en#about"` — the rewritten internal path leaks into the anchor href.

## Run

```bash
npm install
npm run dev
curl -s http://localhost:3000/ | grep -o 'anchor-link[^>]*'
# => anchor-link" href="/en#about"
```

Also reproduces with `npm run build && npm start`, and with `next@canary` (16.3.1-canary.26).

`app-router-comparison/` contains the same setup with the App Router, which correctly renders `href="#about"`.
