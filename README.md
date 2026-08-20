# Repro: vercel/next.js#71197

Pages Router: with `trailingSlash: true`, a `generateBuildId` containing `/`, and a
middleware/proxy in place, client-side navigation to a dynamic route loses the
dynamic route param (`seriesCode` is `undefined`).

## Run

```bash
npm install
npm run build
npm start
node test.mjs   # requires: npx playwright install chromium
```

Open http://localhost:3000/product/1234/?Page=2 (works), then click "go 5678".

## Observed (next@16.3.1-canary.25)

- initial: `query: {"Page":"2","seriesCode":"1234"}`
- after client nav to /product/5678/?Page=2: `query: {"Page":"2"}`, seriesCode `undefined`
- data request `/_next/data/release/v1/product/5678.json?Page=2&seriesCode=5678` returns `{}` / query `{}`

Works if the buildId has no `/`, or if `trailingSlash` is false, or without middleware.
