# Reproduction for vercel/next.js#74646

`Error.prototype.stack` is not sourcemapped on the production server because
`packages/next/src/server/patch-error-inspect.ts` installs
`Error.prepareStackTrace = prepareUnsourcemappedStackTrace`.
Sourcemapping only happens through the `util.inspect` hook, i.e. when the error
*object* is logged - not when the `.stack` string is read, which is what custom
loggers / OpenTelemetry / Datadog integrations do.

## Steps

```bash
npm install
npm run build
npm start                # runs `NODE_OPTIONS=--enable-source-maps next start`
curl localhost:3000
```

## Observed (next@16.3.1-canary.25, Node 24.17.0)

```
stack string  : Error:
    at d (/repro/.next/server/chunks/ssr/_08dd9w8._.js:149:18069)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
error object  : Error:
    at d (app/page.js:9:34)
```

The first stack is minified/unmapped, the second is sourcemapped.
Same result with `next build --webpack` and with the originally reported next@15.1.3.
