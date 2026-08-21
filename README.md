# Repro: next.js#81063 — Node `diagnostics_channel` subscription observes fetches made from the Edge runtime

Next.js version tested: 16.3.1-canary.26 (Turbopack dev + `next build && next start`).

## Run

```bash
npm install
npm run dev
curl http://localhost:3000/api/edge   # runtime = 'edge'
```

## Expected

`instrumentation.ts` only subscribes to the Node `undici:request:create`
diagnostics channel when `process.env.NEXT_RUNTIME === 'nodejs'`. A `fetch()`
performed inside an `export const runtime = 'edge'` route handler should not be
visible to that Node-side subscriber.

## Actual

The Node subscriber fires for the Edge route's fetch:

```
[instrumentation] register in runtime: nodejs
[instrumentation.node] subscribing to undici:request:create
[instrumentation] register in runtime: edge
[edge route] starting fetch to https://example.com
[node diagnostics_channel] undici:request:create -> https://example.com/   <-- leak
[edge route] finished fetch, status 200
```

Also reproduces with `npm run build && npm run start`, so it is not limited to
`next dev`: the emulated Edge runtime delegates outbound fetch to the host
Node/undici stack, so Node diagnostics channels observe Edge requests.
