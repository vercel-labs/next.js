# next.js#91720 — `bunVersion` ignored, functions forced to Node.js (16.2.0 adapter pipeline)

Local, deployment-free reproduction of https://github.com/vercel/next.js/issues/91720.

The reporter's repro needs a Vercel deployment. This one runs the exact same code path
locally: Vercel's Next.js builder sets `NEXT_ADAPTER_PATH` to
`@next-community/adapter-vercel` for Next.js >= 16.2 and passes the parsed `vercel.json`
in `NEXT_ADAPTER_VERCEL_CONFIG`. `scripts/build-with-adapter.mjs` does the same and then
prints the `runtime` of every emitted `.next/output/functions/**/.vc-config.json`.

## Run

```bash
npm install
npm run build:adapter   # exits 1 when any function is not on a bun runtime
```

## Observed (next@16.2.0 + adapter 0.0.1-beta.14)

```
.next/output/functions/index.func: runtime=nodejs24.x
... (8/8 functions)
FAIL: 8 function(s) use a non-bun runtime despite bunVersion "1.x"
```

## Expected (adapter 0.0.1-beta.15, the fix)

```bash
npm install @next-community/adapter-vercel@0.0.1-beta.15
npm run build:adapter
# 8/8 -> runtime=bun1.x, PASS
```

## Root cause

`handleNodeOutputs` in `packages/adapter/src/outputs.ts` called
`getNodeVersion(projectDir, undefined, {}, {})`, discarding the parsed `vercel.json`, so
`bunVersion` could never resolve to the Bun runtime. Fixed in
https://github.com/nextjs/adapter-vercel/pull/44 (released in `0.0.1-beta.15`) by passing
`vercelConfig` instead of `{}`.

The `@vercel/*` packages in `devDependencies` are the runtime deps the adapter expects the
Vercel builder to provide; they are only needed to run the adapter outside Vercel.
