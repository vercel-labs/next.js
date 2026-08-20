# Repro attempt for vercel/next.js#51233 — "OTel http instrumentation confuses NextTracerImpl"

Minimal check of whether `@opentelemetry/instrumentation-http` still produces a
second, unparented trace next to Next.js' own request span, and whether the
incoming W3C `traceparent` is honoured.

## Run

```bash
npm install
npm run build
npm run verify            # with HTTP instrumentation loaded before `http`
```

`verify.mjs` starts `next start` with `--require ./otel-preload.cjs`
(so `HttpInstrumentation` can actually patch `node:http`), sends one request with
`traceparent: 00-11111111111111111111111111111111-2222222222222222-01`, and prints all
spans grouped by trace id. Spans are captured by an in-process exporter that
appends JSON lines to `spans.jsonl`, so no collector/Jaeger is needed.

Variants:

```bash
NEXT_OTEL_VERBOSE=1 npm run verify        # verbose Next.js spans
ENABLE_HTTP_INSTRUMENTATION=1 npm run start-app  # register instrumentation from instrumentation.js instead
```

## Result on next@16.3.1-canary.25 (Node 24)

Single trace `1111…`, whose only root is the `http` span `GET`, parented to the
remote span `2222222222222222`; Next.js' `GET /`
(`next.span_type=BaseServer.handleRequest`) is nested under it. Same with
`NEXT_OTEL_VERBOSE=1`. Without HTTP instrumentation, `GET /` itself is parented
to `2222222222222222`. No duplicate/unparented request trace — the reported
behaviour no longer occurs.
