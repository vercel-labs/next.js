# Repro: no instant loading state on non-prefetched navigation (vercel/next.js#58261)

Next.js 16.3.1, App Router. Every route has a `loading.tsx` and a page that awaits 3s.

- `/no-prefetch` – `<Link prefetch={false}>`
- `/prefetch` – default `<Link>`
- `/link-status` – `<Link prefetch={false}>` + `useLinkStatus()` indicator

## Run

```bash
npm install
npm run build && npm start          # http://localhost:3000
node measure-latency.mjs            # Playwright: 1000ms emulated RTT, prints feedback timings
node measure-linkstatus.mjs         # times the useLinkStatus pending indicator
```

## Measured (prod server, Chromium, 1000ms emulated RTT)

| link | first visual feedback (loading.tsx) | content |
| --- | --- | --- |
| `/no-prefetch` | 1190 ms | 3497 ms |
| `/prefetch` | 401 ms | 3207 ms |
| `/link-status` | 1172 ms (loading.tsx) but `useLinkStatus` pending renders at 63 ms | 3476 ms |

Without prefetch the UI is completely unchanged for one full server round-trip after
the click: `loading.tsx` cannot be shown until the RSC response starts arriving.
`useLinkStatus` is the only feedback that is truly instant.
