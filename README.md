# Repro: next#78420 — edge "Node.js API is used" warning for tree-shaken code

`middleware.js` imports only the `AggregationTemporality` enum from
`@opentelemetry/sdk-metrics`. `ConsoleMetricExporter` (which calls `setImmediate`)
is tree-shaken out of the emitted edge bundle, but `next build` (webpack) still
warns about it.

## Run

```bash
npm install   # or pnpm install
npx next build --webpack
```

Expected: no warning. Actual:

```
./node_modules/@opentelemetry/sdk-metrics/build/esm/export/ConsoleMetricExporter.js
A Node.js API is used (setImmediate at line: 35) which is not supported in the Edge Runtime.
```

Verify the code is not in the bundle:

```bash
grep -c setImmediate .next/server/middleware.js   # 0
grep -c ConsoleMetricExporter .next/server/middleware.js  # 0
```

Notes:
- Reproduces with next 15.2.4 and with next@canary (16.3.1-canary.25) when using `--webpack`.
- Does NOT reproduce with the canary Turbopack build (default in 16.x).
- `@opentelemetry/sdk-metrics` must be pinned to 2.0.0; later versions removed the `setImmediate` call.
