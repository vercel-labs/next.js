# Repro: vercel/next.js#70688 — not-found page keeps previous scroll position

Client-side navigating to a route that calls `notFound()` renders the `not-found`
page while preserving the previous page's scroll position instead of scrolling to top.

## Steps

```bash
npm install
npx playwright install chromium
npm run dev            # http://localhost:3010
# open /foo, scroll to the bottom, click "Click here to trigger not found redirect"
```

Automated check (server must be running):

```bash
BASE=http://localhost:3010 npm run verify
```

Expected: `scrollAfterNotFound` ~0. Observed: it equals the previous scroll position.

`app/not-found.js` is intentionally taller than the viewport, otherwise the short
document forces `scrollY` to 0 and hides the bug.

## Results

| next | mode | scrollBeforeClick | scrollAfterNotFound |
| --- | --- | --- | --- |
| 15.0.0-canary.175 | dev | 2406 | 2388 (bug) |
| 15.0.0-canary.175 | prod (`build` + `start`) | 2406 | 0 (ok) |
| 16.3.1-canary.25 | dev | 2406 | 2388 (bug) |
| 16.3.1-canary.25 | prod | 2406 | 2388 (bug) |

## Cause

`HTTPAccessFallbackErrorBoundary.render()` in
`packages/next/src/client/components/http-access-fallback/error-boundary.tsx`
renders `<meta name="robots" content="noindex" />` *before* the fallback component.
`InnerScrollAndFocusHandler.handlePotentialScroll` uses the first rendered element of
the segment, which is that `<meta>` — a non-rendered node — so no scroll happens.
Unmerged PR #70710 fixed this by rendering the fallback first (dev-only at that time;
the `robots` meta is not dev-gated, which is why current canary also fails in production).
