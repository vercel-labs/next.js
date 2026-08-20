# Repro: next/link does not re-prefetch after network recovery (vercel/next.js#69999)

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # prod server on :3000
npm run repro          # playwright driver
```

`repro.mjs` aborts every RSC request (`_rsc` / `RSC:1`) while "offline", loads `/`
(links `/a` and `/b` are in the viewport, so Next issues prefetches that fail),
then restores the network and dispatches `window` `online` (+ `navigator.onLine = true`).

Observed with next@16.3.1 and next@16.3.1-canary.25 (default config):
no prefetch request is issued after the `online` event ->
`RESULT: NO PREFETCH AFTER ONLINE (bug reproduced)`.

With canary + `USE_OFFLINE=1` (i.e. `experimental.useOffline: true`), the failed
prefetches for `/a` and `/b` are retried on recovery ->
`RESULT: PREFETCH RETRIED (no bug)`.
