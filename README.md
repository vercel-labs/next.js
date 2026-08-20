# Repro: next/font rejects relative `assetPrefix` (issue #52050)

`next.config.js` uses `output: 'export'` + `assetPrefix: './'` and `app/layout.js` imports `next/font/google`.

```
npm install
npx next build --webpack   # FAILS: `next/font` error: assetPrefix must start with a leading slash or be an absolute URL(http:// or https://)
npx next build             # Turbopack (default in Next 16): succeeds, emits ./_next/... including the font woff2
```

Observed with next@16.3.1-canary.25.
