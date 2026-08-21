# next#95199 — dev-server memory baseline probe

Issue https://github.com/vercel/next.js/issues/95199 reports `next dev` using ~2 GB of OS
memory on a large monorepo (FastGPT). The issue links to a third-party issue
(labring/FastGPT#7177), not a runnable minimal reproduction, so this is a minimal
Next 16 + React 19 "hello world" used to measure the dev-server memory *baseline*.

`measure.mjs` spawns `next dev`, waits for ready, issues one request to `/`, and sums the
RSS of the whole `next dev` process tree (CLI process + `next-server` worker).

## Run

    npm install
    npm run measure          # turbopack (default)
    npm run measure -- --webpack

## Observed (Linux, Node 24.17.0, next 16.0.10, react 19.2.0, 2 vCPU / 4 GB)

| bundler   | settled total RSS | peak total RSS |
| --------- | ----------------- | -------------- |
| turbopack | 541 MB            | 693 MB         |
| webpack   | 847 MB            | 847 MB         |

A single-page app never reaches 2 GB, so the reported figure is not reproducible from a
minimal app; it scales with the reporter's workspace size. The baseline itself (0.5–0.85 GB
for one page, webpack ~1.6x turbopack) is the reusable data point.
