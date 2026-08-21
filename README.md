# next#91282 — middleware/proxy tracing emits a second, disconnected trace

Repro of https://github.com/vercel/next.js/issues/91282 without needing docker/jaeger:
`instrumentation.ts` registers a tiny OTel span exporter that appends every finished
span (name, traceId, spanId, parentSpanId) as JSON to `$OTEL_SPAN_LOG`.

## Run

```bash
npm i
rm -f /tmp/spans.jsonl
OTEL_SPAN_LOG=/tmp/spans.jsonl npx next dev -p 3000   # wait for "Ready"
curl -s -o /dev/null http://localhost:3000/
node group-spans.mjs /tmp/spans.jsonl
```

## Expected

One trace per request.

## Actual (next@16.1.6)

Two traces, each with its own root `BaseServer.handleRequest` span:

```
TRACE 8b6f83...  GET            (BaseServer.handleRequest, parent: none)
                 middleware GET (Middleware.execute)
TRACE 91ec4a...  GET /          (BaseServer.handleRequest, parent: none)
                 render route (app) / , build component tree, ...
```

Cause: proxy/middleware invocation goes through `BaseServer.handleRequest`, which calls
`tracer.withPropagatedContext(req.headers, ...)` (next/dist/server/base-server.js) and
therefore starts a new root span from the incoming headers instead of joining the
already-active request span.
