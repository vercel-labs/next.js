# Repro: vercel/next.js#86598 — process listener leak on repeated `router-server` initialize

Each call to `initialize()` in `next/dist/server/lib/router-server` registers a new
`process.on('uncaughtException', logError)` listener and never removes it. In warm
serverless containers (Firebase Cloud Functions / firebase-frameworks) the router server is
initialized more than once per Node process, so listeners accumulate ~1 per request and Node
emits `MaxListenersExceededWarning` after 10.

`serverless-sim.mjs` reproduces this locally by initializing the router server repeatedly in a
single Node process — no deploy required.

## Run

```bash
npm install
npm run build
npm run repro
```

## Observed (next@16.0.7)

```
init #1: uncaughtException=2 ... names=[anonymous, bound logError]
init #12: uncaughtException=13 ... names=[anonymous, bound logError x12]
MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 uncaughtException listeners added to [process].
```

Expected: listener count stays constant across initializations.

Also reproduces on `next@16.3.1-canary.26` (listener name is `logError`); the
`unhandledRejection` registration is already guarded on canary, `uncaughtException` is not
(`packages/next/src/server/lib/router-server.ts`).

`pages/index.jsx` is the reporter's SSR page that prints the live listener count, for use when
deployed (their live demo grows +1 per request).
