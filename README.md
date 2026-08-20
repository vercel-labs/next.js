# Repro: Web workers break `runtime = "edge"` (webpack) — vercel/next.js#67910

A client component instantiating `new Worker(new URL('./worker.js', import.meta.url))` inside a
page that exports `export const runtime = "edge"` makes the edge server bundle include webpack's
jsonp chunk-loading runtime (`__webpack_require__.b = document.baseURI || self.location.href`),
so rendering throws `ReferenceError: document is not defined`.

## Run

```bash
npm install --legacy-peer-deps
npm run dev            # next dev --webpack
curl -i http://localhost:3000    # HTTP 500, "document is not defined"
npm run build          # also fails: Failed to collect page data for /
```

Notes
- Fails with webpack in both `next dev --webpack` and `next build --webpack`.
- Turbopack (Next.js 16 default `next dev`) renders 200 — webpack-only.
- Switching the page to `export const runtime = "nodejs"` works.
