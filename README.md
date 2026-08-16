# Repro: abort-reason `Error` stacks retain per-render RSC flight payloads (next#97434)

Minimal App Router app (`output: "standalone"`, custom `cacheHandler`, `cacheMaxMemorySize: 0`,
nodejs-runtime middleware) + a crawler that requests N **unique** ISR URLs at concurrency 24 and
reads `process.memoryUsage()` from `/api/mem` (`?gc=1` forces `global.gc()`).

`instrument.js` is a `--require` preload that
1. counts `AbortController.prototype.abort()` calls,
2. optionally keeps the last `RETAIN` abort **reasons** alive (simulating any long-lived retention
   of an abort reason: error buffers, breadcrumbs, reporters, Node's `Immediate` queue links, ...),
3. optionally sets `Error.stackTraceLimit = 0` (`STL0=1`).

## Run

```bash
./repro.sh          # builds, runs the same 2000-unique-URL crawl twice (default stack vs stackTraceLimit=0)
```

## Measured (next 16.3.1, react 19.2.5, Node 24.17)

| run | retained abort reasons | `arrayBuffers` after crawl + idle + forced GC |
| --- | --- | --- |
| default `Error.stackTraceLimit = 10` | 5000 | **156 MB (frozen)** |
| `Error.stackTraceLimit = 0` | 5000 | **0 MB** |
| default, `RETAIN=1` | 1 | 0 MB |
| no retention at all (vanilla) | 0 | 0 MB (13 MB baseline) |

* Exactly **5.0 `abort()` calls per render** (10000 aborts / 2000 renders), all on successful renders.
* The dominant reason is created with a stack on every successful render:
  `Error: This render completed successfully. All cacheSignals are now aborted to allow clean up of any unused resources.`
  (plus a reason-less `abort()` and an `AbortError`). See `server-*.log` / `LOGREASONS=1`.
* Vanilla (no retention) does **not** leak here — memory returns to baseline — so the amplifier is
  retention of an abort reason; each retained reason's lazy stack pins that render's store and its
  ~78 KB–400 KB flight payload, which `Error.stackTraceLimit = 0` removes entirely.

Vanilla control (no `instrument.js` preload at all, 4000 unique renders): `arrayBuffers` returns to the
13 MB baseline after forced GC, i.e. the framework alone does not leak in this minimal app on
next 16.3.1 / Node 24 — the retained abort reason is the required amplifier.
