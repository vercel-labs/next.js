# Reproduction: next.js#78591 — importing a large `.wasm` binary makes Turbopack hang

Importing `@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm` (~40 MB) from an App Router page
makes `next dev --turbopack` print `Compiling / ...` and never finish. Turbopack codegen
grows unbounded (Turbopack re-exports every wasm export), memory climbs to the machine
limit and the `next-server` process is eventually OOM-killed; the page never responds.

## Run

```bash
npm install
npm run dev
# then request the page
curl -v http://localhost:3000/
```

## Observed (Node 24, Linux x64, 2 cores / 4 GB RAM)

- next 16.3.1-canary.26: `Compiling / ...`, no HTTP response for 600 s, then
  `Out of memory: Killed process ... next-server` (anon-rss ~4 GB).
- next 15.4.0-canary.10 (version in the issue report): same, OOM-killed after ~8 s.
- Removing the wasm import: `✓ Compiled / in 2.4s`, HTTP 200.
- `...duckdb-mvp.wasm?module` (suggested workaround) fails with
  `Module not found: Can't resolve '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'`
  because of `package.json#exports` in `@duckdb/duckdb-wasm`.
