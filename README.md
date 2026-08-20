# Repro: #67737 — middleware pollutes OpenTelemetry traces (`next.bubble` spans + orphan middleware trace)

Self-contained repro; no external OTLP backend needed. `collector.mjs` is a tiny
OTLP/HTTP-JSON receiver that prints one line per exported span.

## Run

```bash
npm install
node collector.mjs                 # terminal 1 (listens on :4318)
NEXT_OTEL_VERBOSE=1 npm run dev    # terminal 2  (or: npm run build && NEXT_OTEL_VERBOSE=1 npm start)
curl http://localhost:3000/        # middleware rewrites / -> /da
```

## Observed (next@16.3.1-canary.25, dev and next start)

A single request to `/` produces three unrelated traces:

1. the real request trace (`GET /` -> `BaseServer.render` -> `render route (app) /[locale]` ...),
2. an **extra** root trace with `GET / | NextServer.getServerRequestHandler | NextServer.getRequestHandler`
   all carrying `next.bubble = true` and no render children,
3. a separate root trace containing only `middleware GET` — its traceId differs from (1) and (2),
   which the middleware's own `trace.getActiveSpan()` confirms.

## Expected

The middleware span should be part of the request trace, and no duplicate
`next.bubble=true` root trace should be exported.

## Control

Deleting `middleware.ts` and rebuilding removes both the `next.bubble` spans and the
duplicate `GET` trace (verified: 0 spans with `next.bubble`).
