# Reproduction: `next dev` overrides container-aware V8 heap limit with host memory

Upstream issue: https://github.com/vercel/next.js/issues/98381

`packages/next/src/cli/next-dev.ts` sets
`NODE_OPTIONS=--max-old-space-size=floor(os.totalmem() / 1MB * 0.5)` unless
`NEXT_DISABLE_MEM_OVERRIDE` is set. `os.totalmem()` reports *host* RAM, so
inside a cgroup/container the dev server gets a heap limit far above the
enforced memory limit, replacing the container-aware default Node picked from
`process.constrainedMemory()`.

## Run

Docker (as reported):

```bash
docker run --rm -m 2g -v "$PWD":/repro:ro node:22 sh -c \
  'cp -r /repro /app && cd /app && npm i && ./reproduce.sh'
```

Any Linux host with cgroup v2 write access (no Docker needed):

```bash
npm install
./reproduce.sh          # 512 MB memory cgroup, override with LIMIT_BYTES=...
```

`reproduce.sh` puts itself into a memory-limited cgroup v2 group, prints what
Node sees, starts `next dev`, dumps the dev server's `NODE_OPTIONS`, and asks
`/api/mem` for the heap limit actually in effect inside the dev server.

## Observed (Next.js 16.3.4 and 16.4.0-canary.21, Node 24, cgroup limit 512 MB)

```text
os.totalmem               4283 MB
process.constrainedMemory  512 MB
node default heap limit    259 MB
what next dev configures  2141 MB

pid 1100: NODE_OPTIONS=--max-old-space-size=2141 --enable-source-maps
{"pid":1100,"osTotalMemMB":4283,"constrainedMemoryMB":512,"v8HeapSizeLimitMB":2144,...}
```

With `NEXT_DISABLE_MEM_OVERRIDE=1` the same setup yields
`v8HeapSizeLimitMB: 259`, i.e. Node's container-aware value.
