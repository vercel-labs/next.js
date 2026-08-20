# Reproduction for vercel/next.js#66180

`process.version` is `undefined` inside the Edge Runtime sandbox used by `next build`
(page-data / config collection), because `createProcessPolyfill` in
`packages/next/src/server/web/sandbox/context.ts` only polyfills `process.env` and turns every
other non-function `process` key into `undefined`. Libraries that gate on `process.version`
at module scope (e.g. `@neynar/nodejs-sdk` in the original report) then log
`Unsupported Node.js version! Your version: undefined.` and call `process.exit`, which fails the build.

## Run

```bash
npm install
npm run build
```

## Expected

`process.version` reports the Node.js version (or the build does not break on it).

## Actual

```
[repro] typeof process.version = undefined / value = undefined
Unsupported Node.js version! Your version: undefined. Required version: >=19.9.0.
Error: Failed to collect configuration for /api/edge
  [cause]: Error: A Node.js API is used (process.exit) which is not supported in the Edge Runtime.
```

Verified with `next@16.3.1-canary.25` (Turbopack build) and `next@14.2.3` (original report, webpack).
