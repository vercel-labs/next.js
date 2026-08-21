# Next.js + `@opentelemetry/instrumentation-http`: incoming requests are never instrumented via `instrumentation.ts`

Minimal reproduction: the OpenTelemetry setup follows the
[Next.js OpenTelemetry guide (manual configuration)](https://nextjs.org/docs/app/guides/open-telemetry#manual-opentelemetry-configuration)
plus `@opentelemetry/instrumentation-http` with a `responseHook` that sets an
`x-otel-trace-id` response header — used as an externally observable marker of
whether the instrumentation actually handles incoming requests.

## Run

```bash
npm install
npm run build
npm run start
# in another terminal:
curl -sI http://localhost:3000/ | grep -i x-otel-trace-id   # <-- nothing
```

The SDK starts fine (`[repro] OTel NodeSDK started` is printed), Next's own
`next.js`-scoped spans are exported to the console — but there are **no HTTP
server spans and no `x-otel-trace-id` header** on any request:
`@opentelemetry/instrumentation-http` never attaches. The failure is silent.

## Control: the same code loaded via `--require`

```bash
npm run start:preload
curl -sI http://localhost:3000/ | grep -i x-otel-trace-id   # <-- header present
```

`otel-preload.cjs` is the exact same SDK setup loaded via
`NODE_OPTIONS="--require ./otel-preload.cjs"` instead of `instrumentation.ts`.
HTTP server spans and the header appear on every request.

## Results

| Setup | `x-otel-trace-id` header | HTTP server spans |
|---|---|---|
| `instrumentation.ts` (this repo, next 16.2.10) | 0/3 requests | none (only `next.js`-scoped spans) |
| `instrumentation.ts` (same files, next 15.5.20, webpack) | 0/3 requests | none |
| same code via `NODE_OPTIONS="--require"` (either version) | 3/3 requests | present |

## Why

`HttpInstrumentation` patches `http`/`https` through `require-in-the-middle`,
which wraps `Module.prototype.require` and applies the patch on the **next**
`require('http')` call passing through it (a cache hit is fine).

- In standalone mode the generated `server.js` requires
  `next/dist/server/lib/start-server`, which imports `http`/`https` at module
  top ([start-server.ts#L18-L19](https://github.com/vercel/next.js/blob/v15.5.12/packages/next/src/server/lib/start-server.ts#L18-L19)) —
  long before `register()` runs (`startServer()` → `server.listen` →
  `getRequestHandlers` → `NextServer.prepare` → `runInstrumentationHookIfAvailable`).
- Nothing guarantees a `require('http')` **after** `register()`: the bundler's
  externals factories for `http` inside route chunks evaluate lazily (for most
  pages never), and the factory of the `instrumentation` chunk itself evaluates
  while that chunk is being imported — before the hook is armed inside
  `register()`. Whether the instrumentation ever attaches depends on the
  accidental import graph of the app; a hello-world never wins this race.

Confirmed by an OpenTelemetry maintainer in
[open-telemetry/opentelemetry-js-contrib#3209](https://github.com/open-telemetry/opentelemetry-js-contrib/issues/3209#issuecomment-3548891892):
“if Next internally imports or requires the `http` module before we've had a
chance to patch it, it won't be patched”.

## Workaround without `--require`

`require-in-the-middle` >= 7.4 also hooks
[`process.getBuiltinModule`](https://github.com/elastic/require-in-the-middle/blob/v7.4.0/index.js#L145-L147),
so one call right after `sdk.start()` inside `instrumentation.ts` applies the
pending patch to the already-loaded core modules (public Node >= 20.16 API,
untouched by bundlers):

```js
sdk.start();
process.getBuiltinModule('http');
process.getBuiltinModule('https');
```

---

## Verified reproduction (issue #95894 mirror)

Mirrored from https://github.com/r34son/next-otel-http-instrumentation-repro
(commit b21a6745bd027b679a6c5d09d822275382605c39) with the private-registry
`package-lock.json` removed so `npm install` works on the public npm registry.

Verified on Linux, Node 24.17.0, next@16.2.10:

```bash
npm install
npm run build
node .next/standalone/server.js          # header: 0/3 requests, only next.js spans
npx next start                           # header: 0/3 requests (not standalone-specific)
npm run start:preload                    # header: 3/3 requests, @opentelemetry/instrumentation-http spans
# appending process.getBuiltinModule('http'/'https') after sdk.start()
# in instrumentation-node.js: header 3/3 requests
```
