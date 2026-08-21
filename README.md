# Repro: Turbopack dev client error frames are not mapped to original sources (Sentry / Spotlight)

Issue: https://github.com/vercel/next.js/issues/92857 — Next.js 16.2.3, @sentry/nextjs 10.70.0.

## Run

```bash
npm install
npm run dev            # Turbopack, port 3000  (broken)
node check-sentry.mjs http://localhost:3000 turbopack
node check.mjs        http://localhost:3000 turbopack

npm run dev:webpack    # Webpack, port 3001    (works)
node check-sentry.mjs http://localhost:3001 webpack
```

`check-sentry.mjs` clicks the button, grabs the Sentry event captured in `beforeSend`
and prints the top stack frames. `check.mjs` prints the raw `Error.stack` and resolves
each frame through the source map the dev server serves.

## Result

Turbopack dev (`experimental.turbopackSourceMaps` + `turbopackInputSourceMaps` on):

```
app:///_next/static/chunks/_0rv5pxl._.js :: onClick 20:23
```

Webpack dev (`next dev --webpack`, default `eval-source-map`):

```
app/page.tsx :: onClick 11:17
```

Raw V8 stacks explain it: webpack `eval` modules report `webpack-internal:///(app-pages-browser)/./app/page.tsx`,
so the SDK sees the original path with no map lookup, while Turbopack reports the chunk URL.
Turbopack *does* serve `<chunk>.js.map` (HTTP 200) and it maps correctly
(`_0rv5pxl._.js:17:23` -> `file:///.../app/page.tsx:9:16`), but it is an indexed/sectioned
map (`sections[]`, top-level `sources: []`) whose `sources` are absolute `file:///` URLs.
