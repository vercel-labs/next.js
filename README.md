# Repro: `examples/with-mqtt-js` ends the MQTT connection on unmount (issue #69109)

`examples/with-mqtt-js/lib/useMqtt.ts` (copied here **verbatim** from `canary`) calls
`client.end()` in its `useEffect` cleanup. Any page/component that reuses the connected
client (context, module singleton, second page) therefore gets a dead client as soon as
the component that created it unmounts.

Contents:

- `lib/useMqtt.ts` — verbatim copy of the example hook.
- `app/page.tsx` — the example page, plus it stores the connected client in
  `lib/sharedClient.ts` (what any app does to reuse the connection) and links to `/other`.
- `app/other/page.tsx` — second page that reads the shared client and tries to publish.
- `scripts/broker.mjs` — local aedes MQTT-over-WebSocket broker on `ws://127.0.0.1:1884`
  (no public broker needed). `.env.local` points the example at it.
- `scripts/repro.mjs` — Playwright driver that publishes on `/`, navigates to `/other`
  and prints the shared client state + publish result.

## Run

```bash
npm install
npx playwright install chromium   # or set CHROME_PATH to a Chromium binary
npm run broker &                  # local MQTT broker
npm run build && npm run start &  # production build (dev mode is broken even harder, see below)
npm run repro
```

## Observed (production build, next@canary)

```
[repro] STEP 1 home page after publish -> messages: 1 | shared client: connected=true disconnecting=false
[repro] STEP 2 shared client state on /other -> connected=true disconnecting=true
[repro] STEP 2 publish from /other -> publish callback error: client disconnecting
```

Broker log confirms `client disconnected: repro_client` right at the client-side
navigation from `/` to `/other`.

## Extra: `next dev` is worse

With React's dev-time double-invoked effects, the cleanup ends the first client and the
`if (clientRef.current) return;` guard prevents a new one from being created, so the
example's own page never has a usable connection in dev:

```
[repro] STEP 1 home page after publish -> messages: 0 | shared client: connected=false disconnected=true disconnecting=true
```
