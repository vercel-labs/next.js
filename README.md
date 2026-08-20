# Repro: issue #30738 — `EPERM: operation not permitted, open '.next\trace'` when running `next build` while `next dev` runs

Original report: Next.js 12.0.x on **Windows**. Running `next build` while `next dev` was
running crashed with an unhandled `error` event from the trace `WriteStream`:
`Error: EPERM: operation not permitted, open 'D:\...\.next\trace'`.

## Run

```bash
npm install
npm run repro    # starts `next dev`, then runs `next build` concurrently
```

## Result on Next.js 16.3.1 (Linux, Node 24)

`next build` finishes with exit code 0; no `EPERM` / `WriteStream` error.
Two reasons the original crash no longer applies:

1. `EPERM` on an already-open file is Windows-specific (POSIX allows concurrent opens),
   so the crash cannot occur on Linux/macOS at all.
2. In modern Next.js the dev server uses `distDir` `.next/dev`, so the dev trace stream
   writes `.next/dev/trace` while `next build` writes `.next/trace` — the two processes
   no longer share the same trace file. In 12.0.2
   (`next/dist/trace/report/to-json.js`) both phases opened `.next/trace`, and
   `RotatingWriteStream.rotate()` also `unlinkSync`s it, which is what Windows rejects.
