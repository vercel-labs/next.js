# Repro: vercel/next.js#73830 — `dynamic()` ignores the parent `<Suspense>` hierarchy

Minimal pages-router repro (next 15.1.1, react 19.0.0). `_app.js` wraps
`Header + <Component/> + Footer` in a single `<Suspense fallback={...}>`.

* `/dyn`  — content loaded with `next/dynamic(..., { ssr: false })` (1s artificial chunk delay)
* `/lazy` — identical content loaded with `React.lazy` (control)
* `/dyn-loading-null` — attempt to opt out of the internal fallback with `loading: null`

## Run

    npm install
    npm run build && npm start        # http://localhost:3000
    node check.mjs                    # Playwright: records per-frame DOM text during client nav

## Observed

Navigating index -> /dyn: for ~1000 ms the DOM contains only `HEADER ... FOOTER`
with no page content, and the parent `<Suspense>` fallback is never shown —
i.e. the layout collapses/flickers. Navigating index -> /lazy shows no such
frame (previous content is kept until the lazy chunk resolves).

`/dyn-loading-null` crashes with React error #130 / #419
("Application error: a client-side exception has occurred").
