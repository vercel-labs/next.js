# Repro: cross-origin `next dev` assets return 403 in Next.js >= 16.2.0 (vercel/next.js#94075)

React never hydrates in a cross-origin WebView (Tauri v2 Android dev) because every
`/_next/static/chunks/*` request is answered with `403 Unauthorized` by
`blockCrossSiteDEV`, so no client JavaScript ever runs. The HMR WebSocket is not the cause.

In `next@<=16.1.7` the same check only *warned* when `allowedDevOrigins` was not
configured (`const mode = typeof allowedDevOrigins === 'undefined' ? 'warn' : 'block'`);
in `next@>=16.2.0` it always blocks — including for `Origin: null`, which is what
WebViews/opaque origins send and which cannot be allowlisted at all.

## Run (no device needed)

```bash
pnpm install
pnpm verify
```

Expected (16.2.6):

```
Origin: http://127.0.0.1:3000 -> 403 "Unauthorized"
Origin: null                  -> 403 "Unauthorized"
```

With `pnpm add next@16.1.7` both return `200`.

## Browser check

```bash
TAURI_DEV_HOST=localhost pnpm dev      # assetPrefix -> http://localhost:3000
# open http://127.0.0.1:3000  (a different origin, like the WebView)
```

16.2.6: page stays "❌ Waiting for hydration...", button dead, only 403s in the network tab.
16.1.7 / 16.0.10, or adding `allowedDevOrigins: ["127.0.0.1"]`: "✅ React hydrated".
