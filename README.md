# Reproduction for vercel/next.js#97646

`MaxListenersExceededWarning: ... 11 close listeners added to [ServerResponse]` with
`@sentry/nextjs` (OpenTelemetry) on Next.js 16.3.1, App Router, Node.js runtime.

## Setup

```bash
npm install
```

## Reproduce (dev server, emits the exact Node warning)

```bash
npm run dev:probe            # next dev -p 3001 with a probe that logs every close listener
# in another shell:
node load.mjs                # or: curl http://localhost:3001/api/stream
```

Server log:

```
[probe] close#11 url=/api/stream :: at createWriterFromResponse ... at pipeToNodeResponse ...
(node:3301) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 close listeners added to [ServerResponse]. MaxListeners is 10.
```

## Reproduce (production, one listener below the cap)

```bash
npm run build
npm run start:probe
PORT=3000 node load.mjs
```

Max `close` listeners per `ServerResponse` observed (Next.js 16.3.1, Node 24):

| request                          | next start | next dev |
| -------------------------------- | ---------- | -------- |
| `/api/stream` (route handler)    | 10         | **11**   |
| `/x/a/b/c` (page, generateMetadata) | 8       | 9        |
| same, `DISABLE_SENTRY=1`         | 8 / 6      | -        |

So Next.js itself registers 6–8 `close` listeners per request and `@sentry/nextjs`
adds 2 more, leaving zero headroom under Node's default `MaxListeners = 10`.

`probe.cjs` patches `ServerResponse.prototype.on` only to log the listener count and
the registering call site; it does not add listeners itself.

Listener sources seen for `/api/stream` (`next start`):

1. Sentry `recordRequestSession`
2. Sentry OTel http instrumentation (`SentryAsyncLocalStorageContextManager`)
3. `requestHandlerImpl` (`next/dist/server/lib/router-server.js`)
4. `signalFromNodeResponse` / `createAbortController` (middleware request)
5. `signalFromNodeResponse` / `createAbortController` (route request)
6. `NextRequestAdapter` / work store
7. + 8. `AfterContext.onClose` (`after()`)
9. + 10. `pipeToNodeResponse` / `createWriterFromResponse` (streaming response)

## Notes

- No `setMaxListeners` call is made by Next.js on the `ServerResponse`.
- `Unexpected root span type 'ResolveMetadata.generateMetadata'` (also mentioned in the
  issue, addressed by PR #93158) did NOT appear in this setup: `next build`
  (Turbopack and `--webpack`), `next start` and `next dev` were exercised with the
  Sentry OTel provider active and 600 concurrent-ish requests.
