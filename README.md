# Next.js #74992 - request aborted after ~5 minutes (Node `requestTimeout` default)

Headless reproduction of https://github.com/vercel/next.js/issues/74992 - no browser
DevTools throttling and no large file needed. `slow-upload.mjs` streams 64 KB/s
(~0.5 Mbps) into a route handler that consumes `request.body`.

## Run

```bash
npm install
npm run dev                 # or: npm run build && npm start
npm run slow-upload         # second terminal; env: PORT=3000 SECONDS=420
```

## Observed (next 16.3.0, both `next dev` and `next start`)

```
[client] sent 19660800 bytes at 300.2s
[client] response 408 at 307.2s
# server
POST /api/upload 200 in 5.1min
[route] ERROR after 305.8s, 20054016 bytes received: Error: aborted { code: 'ECONNRESET' }
```

## Cause

`packages/next/src/server/lib/start-server.ts` calls `http.createServer(requestListener)`
with no options, so Node's default `server.requestTimeout` of 300000 ms applies and there
is no Next.js config knob to change it. Setting `requestTimeout: 0` on that server lets the
same upload continue past 5 minutes.
