# Repro: OpenTelemetry `http.server.request.duration` is never emitted from `instrumentation.ts`

Minimal, docker-free reproduction for https://github.com/vercel/next.js/issues/80262

`@opentelemetry/auto-instrumentations-node` is started from Next.js'
`instrumentation.ts` `register()` hook. Client-side HTTP metrics
(`http.client.request.duration` from `instrumentation-undici`) are exported, but
`@opentelemetry/instrumentation-http` never emits
`http.server.request.duration`, because Next.js has already loaded Node's `http`
module by the time `register()` runs, so `require-in-the-middle` cannot patch it.

Instead of the OTLP exporter + otel-collector + Prometheus from the original
report, this repro uses a tiny in-process `PushMetricExporter` that appends every
exported metric name to a log file, so a single `grep` proves the result.

## Run (repro — broken)

```bash
npm install
rm -f /tmp/otel-metrics.log
OTEL_METRICS_LOG=/tmp/otel-metrics.log npm run dev
# in another shell:
for i in 1 2 3 4 5; do curl -s -o /dev/null http://127.0.0.1:3000/; done
sleep 5
sort -u /tmp/otel-metrics.log | grep http
```

Observed:

```
@opentelemetry/instrumentation-undici :: http.client.request.duration
```

`http.server.request.duration` is absent, and the
`@opentelemetry/instrumentation-http` scope never appears at all.

## Run (control — works)

Same SDK config, but loaded with `node --import` before Next boots:

```bash
mv instrumentation.ts instrumentation.ts.bak   # avoid a second SDK
rm -f /tmp/otel-metrics-preload.log
NODE_OPTIONS="--import file://$PWD/otel-preload.mjs" \
  OTEL_METRICS_LOG=/tmp/otel-metrics-preload.log npx next dev
# in another shell:
for i in 1 2 3; do curl -s -o /dev/null http://127.0.0.1:3000/; done
sleep 5
sort -u /tmp/otel-metrics-preload.log | grep http
```

Observed:

```
@opentelemetry/instrumentation-http :: http.client.request.duration
@opentelemetry/instrumentation-http :: http.server.request.duration
@opentelemetry/instrumentation-undici :: http.client.request.duration
```

## Note on `next.config.js` vs `next.config.ts`

A comment on the issue suggests using `next.config.js` instead of
`next.config.ts`. Renaming the config to `next.config.js` and re-running the
broken case still yields only
`@opentelemetry/instrumentation-undici :: http.client.request.duration`, so the
config file extension is **not** the cause.

Verified with next@16.3.1, @opentelemetry/auto-instrumentations-node@0.79.0,
Node 24.17.0.
