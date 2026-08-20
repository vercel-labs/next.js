# Repro: next.js#64879 — OpenTelemetry cannot patch native modules from `instrumentation.ts`

The reporter's original repo (`lforst/nextjs-instrumentation-behaviour-repro`) is no longer
public (HTTP 404), so this is a minimal Sentry-free reproduction using
`@opentelemetry/instrumentation-http` directly.

## Run

```sh
npm i
npm run build
npm start
curl http://localhost:3000/make-req
```

## Expected

`{"hasTraceparent":true,...}` and the server log contains
`@opentelemetry/instrumentation-http Applying instrumentation patch for nodejs core module on require hook { module: 'http' }`
plus the `requestHook`/`responseHook` markers.

## Actual (next 15.5.4, node 24)

`{"hasTraceparent":false,...}` — no `traceparent` header reaches `/check`, no patch log,
hooks never fire. `.next/server/instrumentation.js` contains
`81630:a=>{a.exports=require("http")}`, i.e. the bundle resolves `http` (and other core
modules) before `register()` runs, so `require-in-the-middle` has nothing left to patch.

Removing `import * as http from 'http'` from `instrumentation.js` does **not** help: the
OTel dependency graph itself is bundled and still caches `require("http")`.

## Control

`node control.cjs` (same OTel setup, plain Node, no Next.js) prints the patch log,
fires the hooks and propagates `traceparent`.
