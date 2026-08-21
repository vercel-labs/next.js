# Repro: asset-loading error swallowed by same-URL invariant (vercel/next.js#80124)

Automated version of the reporter's repro (https://github.com/zachkirsch/nextjs-asset-loading-error-repro),
which replaces the manual Chrome DevTools "Block request URL" step with a Playwright route abort.

```bash
npm install
npx playwright install chromium
npx next dev -p 3000 &   # wait for "Ready"
npm run repro
```

`repro.mjs` loads `/`, clicks `router.push(window.location.href)` once (succeeds), then aborts
`**/index.json*` and clicks again.

Observed on both `next@15.4.0-canary.62` (reported) and `next@16.3.1-canary.26`:

```
[console.error] Failed to load resource: net::ERR_FAILED
[pageerror] Invariant: attempted to hard navigate to the same URL / http://localhost:3000/
```

Expected: an error saying `index.json` failed to load. The real asset error is swallowed by
`handleHardNavigation` in `packages/next/src/shared/lib/router/router.ts`.
