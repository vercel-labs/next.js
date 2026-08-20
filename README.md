# Repro: vercel/next.js#59092 — `config.resolve.alias` for `react` breaks App Router

Aliasing `react` / `react-dom` to their package directory in a webpack config makes
the App Router server build resolve the client (browser/default) build of React
instead of the `react-server` condition, so `react.cache` is missing.

## Run

```bash
npm install
npm run dev -- --webpack   # then open http://localhost:3000  -> 500
# or
npm run build              # -> build error
```

Control (works): `NO_ALIAS=1 npm run build`

## Observed (next@16.3.1-canary.25, webpack)

dev: `⨯ TypeError: (0 , _react.cache) is not a function` and HTTP 500 on `/`
build: `TypeError: (0 , i.cache) is not a function` → `Error: Failed to collect page data for /_not-found`

Next.js 16 defaults to Turbopack, so `--webpack` is required to exercise the reported webpack path.
