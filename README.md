# Repro: vercel/next.js#70977 — stale link navigations update the UI in `next dev`

Mirror of https://github.com/samselikoff/stale-link-updates-in-dev with versions pinned to
the ones in the report (`next@15.0.0-canary.179`, `react@19.0.0-rc-2d16326d-20240930`), since
`next@canary` no longer reproduces.

## Run

```bash
npm install --legacy-peer-deps
npx playwright install chromium
npm run dev
# in another shell, after the /post/[id] route has been compiled once:
node stale-nav-test.mjs http://localhost:3000 dev
```

The script clicks Post 1, Post 2, Post 3 with 120 ms gaps and logs every text change.

## Result

- `next dev` (canary.179): `Home -> Post 1 -> Post 2 -> Post 3` — stale navigations render.
- `next build && next start` (same version): `Home -> Post 3` only.
- `next dev` on `next@16.3.1-canary.25` + `react@19.2.8`: `Home -> Post 3` only (fixed).

Note: the route must be compiled at least once (run the script twice, or visit `/post/1`
first); on the very first cold compile the dev delay masks the stale renders.
