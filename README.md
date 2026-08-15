# Repro: memory retained per render grows with nested `use cache` depth

Mirror of https://github.com/kkorach/nextjs-memory-retention for
https://github.com/vercel/next.js/issues/97424, with `run-local.sh` /
`run-series.sh` added (the original `run-ret.sh` requires `lsof`, which is not
available in every Linux container).

next 16.3.1-canary.18 (pinned by package-lock.json), react 19.2.8,
`cacheComponents: true`, `output: 'standalone'`.

## Run

```bash
npm install
npm run build

NAME=d1 CACHE_DEPTH=1 RENDERS=200 bash run-local.sh   # single `use cache` level
NAME=d5 CACHE_DEPTH=5 RENDERS=200 bash run-local.sh   # five nested `use cache` levels

# post-GC heap trend over 3 x 200 renders
NAME=s-d5-distinct CACHE_DEPTH=5 bash run-series.sh
NAME=s-d1-distinct CACHE_DEPTH=1 bash run-series.sh
NAME=s-d5-repeat   CACHE_DEPTH=5 REPEAT=1 bash run-series.sh   # control: 8 repeated slugs
```

`retention-probe.cjs` wraps `AbortController.prototype.abort`, keeps a `WeakRef`
to 1 in 20 abort-reason `Error`s, forces two full GCs on `SIGUSR2` and counts
survivors plus `heapUsed`.

## Observed (Linux x64, Node 24.17, 2 vCPU)

```
RET d1  mode=fn depth=1  created=  31.2/render  retained=   3.3/render  heapPostGC=100.2MB
RET d5  mode=fn depth=5  created= 151.8/render  retained=   8.1/render  heapPostGC=148.4MB
```

post-GC heap after 200 / 400 / 600 distinct renders:

| arm | 200 | 400 | 600 |
| --- | --- | --- | --- |
| depth=5, distinct slugs | 162.3MB | 183.4MB | 204.5MB |
| depth=1, distinct slugs | 78.7MB | 83.1MB | 74.7MB |
| depth=5, 8 repeated slugs | 129.2MB | 129.9MB | 131.0MB |

Only depth>1 with distinct cache keys grows monotonically after a forced full GC.
