# Repro: vercel/next.js#80445 — OpenTelemetry tracing limitations in middleware

Minimal repro of https://github.com/vercel/next.js/issues/80445 without Jaeger:
`instrumentation.node.js` registers a span processor that appends every finished
span (traceId / parentSpanId / name / `next.span_type` / `next.bubble`) to `spans.log`,
and `check.mjs` groups them by trace id.

## Run

```bash
npm install
OTEL_LOG_FILE=$PWD/spans.log npx next dev -p 3000 > dev.log 2>&1 &
curl -s -o /dev/null http://localhost:3000/
sleep 3 && node check.mjs
```

## Observed (next@15.3.2 and next@16.3.1-canary.26)

- One request to `/` produces **two separate traces**, each with a root
  `BaseServer.handleRequest` span; the first one only carries `next.bubble: true`
  (from the middleware pass), the render spans live in a different trace id.
- With the default (edge) middleware, the custom `middleware-custom-span` created
  with `@opentelemetry/api` in `middleware.js` never reaches the collector at all.
- Appending `export const runtime = 'nodejs'` to `middleware.js` makes the
  middleware spans appear, but in yet another trace id (3 traces for one request).
