# Repro: `<Link>` does not scroll to hash anchor when target is inside a `<Suspense>` boundary

Upstream issue: https://github.com/vercel/next.js/issues/65960
Original reporter repro: https://github.com/kachkaev/next-link-scroll-with-suspense-mwe
(dependencies refreshed to current `next@canary` + React 19 stable, which the original pinned versions no longer installed with).

## Run

```bash
npm install
npm run dev   # or: npm run build && npm run start
```

1. Open http://localhost:3000/
2. Click `/products#category-42` -> page scrolls so `<h2 id="category-42">` is in the viewport (correct).
3. Go back to `/`.
4. Click `/products-with-suspense#category-42` (same content, rendered inside `<Suspense>` behind a 100ms delay).
5. Page stays at scrollY 0; the anchor is never scrolled to.

Measured with Playwright on next@16.3.1-canary.25 (Node 24):

| navigation | scrollY | `#category-42` bounding top |
| --- | --- | --- |
| `/products#category-42` | 2041 | -0.06 (in view) |
| `/products-with-suspense#category-42` | 0 | 2041 (off-screen) |

Same result with `next dev` and `next build && next start`.
