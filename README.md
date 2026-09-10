# Repro for vercel/next.js#98492 — `next dev` RangeError "Maximum call stack size exceeded" on the first cold-compiled deep route

Original reporter repro: https://github.com/dennisat/nextjs-call-stack-size-exceeded-2026-09
(that one uses 8 URL segments and reproduces on macOS/arm64 + Node 20.16; on linux/x64 the same app
returns 200 because the stack margin there is a bit larger — see "Measurements" below).

This variant reproduces the identical failure (same React Flight `requireModule` /
Fizz `getComponentNameFromType` overflow site) on **linux/x64 + Node 20.16.0** by using a
10-segment route and a plain 200-deep nested client component tree.

## Run

```bash
pnpm install     # or npm install
./repro.sh deep      # cold start, request /s10/a/b/c/d/e/f/g/h/i (10 segments) first
./repro.sh shallow   # cold start, request /s3/a/b (3 segments) first
```

## Observed (Node 20.16.0, linux x64, next 16.4.0-canary.25, Turbopack)

```
./repro.sh deep
first    /s10/a/b/c/d/e/f/g/h/i -> 500   RangeError: Maximum call stack size exceeded
second   /s10/a/b/c/d/e/f/g/h/i -> 500
third    /s3/a/b                -> 500
fourth   /s10/a/b/c/d/e/f/g/h/i -> 500

./repro.sh shallow
first    /s3/a/b                -> 200
second   /s10/a/b/c/d/e/f/g/h/i -> 200
```

Same route, same process, only the compile order differs.

Error page stack (first 12 frames) matches the issue report exactly:

```
RangeError: Maximum call stack size exceeded
    at [turbopack]_runtime.js instantiateModule / commonJsRequire
    at globalThis.__next_require__     (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js)
    at requireModule
    at initializeModuleChunk
    at readChunk
    at readChunkAndTransferValidation
    at getComponentNameFromType
    at retryNode / renderNodeDestructive / renderNode / renderChildrenArray / renderElement ...
```

## Measurements (why the segment count matters)

A `"use client"` probe that recurses until it catches a RangeError reports the remaining SSR (Fizz)
stack headroom, on a cold start where that route is the first one compiled (linux/x64, Node 20.16,
default ~984 KB V8 stack):

| URL segments | remaining frames (cold, first route compiled) |
|--------------|----------------------------------------------|
| 3            | 5949 |
| 5            | 4294 |
| 7            | 2640 |
| 8            | 1813 |
| 9            | 986  |
| 10           | 158 (with a shallower route compiled first) / overflow when compiled first |
| 12           | 8900 |

So each extra URL segment costs ~830 stack frames on the cold-compile render, up to ~10 segments,
after which the cost collapses again — which explains the reporter's "8 fails, 9/10/12 don't" on
macOS/arm64 (bigger frames shift the cliff to 8) and "10 fails, 12 doesn't" here.

For the same route, cold-compile render vs. render after another route already compiled:
`10188` vs `15309` remaining frames in the RSC pass — the cold compile burns ~5k frames of stack
because module instantiation happens inside the render recursion (`requireModule` under
`getComponentNameFromType`).

## Variants checked here

| Variant                                             | Result |
|-----------------------------------------------------|--------|
| as committed (Node 20.16.0, Turbopack)              | 500 RangeError |
| `cacheComponents` removed from next.config.ts        | 200 |
| Node 24.20.0                                        | 200 |
| shallower route compiled first                      | 200 |
