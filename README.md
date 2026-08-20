# Reproduction: vercel/next.js#69682

App Router dev server intermittently serves an **empty (0-byte) `/_next/static/chunks/app/layout.js`**
on the first request after a cold start, so the root layout's `"use client"` context provider never
hydrates (its `console.log` never runs, the app is not interactive). Occasionally the chunk is served
partially written instead, producing `Uncaught SyntaxError: Invalid or unexpected token (at layout.js)`.

Mirrors https://github.com/jmderby/min-repro-next-render-issue plus a deterministic harness that
repeats the cold start and asserts hydration.

## Run

```bash
pnpm i
pnpm add -D playwright && npx playwright install chromium
node harness.js 6           # 6 cold starts of `next dev`
```

## Expected vs observed

- Expected: every cold start prints `inside TestContext (local)` in the browser console and hydrates.
- Observed on `next@14.2.7` (Node 24, Linux): 4/6 cold starts printed nothing and `document.body`
  had no React fiber keys; the `layout.js` chunk response was `200` with `0` bytes while the file on
  disk was ~125 kB moments later. One run also raised `pageerror: Invalid or unexpected token`.
- On `next@16.3.1` (React 19), 6/6 Turbopack and 6/6 `--webpack` cold starts hydrated correctly.

Manual variant: `pnpm dev`, open http://localhost:3000 and watch the browser console; restart the
server (`rm -rf .next && pnpm dev`) between attempts.

## Latest validated harness output (`next@14.2.7`)

```
iteration 1: providerLog=true  hydrated=true  parseError=false layoutChunk={"status":200,"bytes":125211}
iteration 2: providerLog=true  hydrated=true  parseError=false layoutChunk={"status":200,"bytes":125211}
iteration 3: providerLog=false hydrated=false parseError=false layoutChunk={"status":200,"bytes":0}
iteration 4: providerLog=true  hydrated=true  parseError=false layoutChunk={"status":200,"bytes":125211}
iteration 5: providerLog=true  hydrated=true  parseError=false layoutChunk={"status":200,"bytes":125211}
iteration 6: providerLog=false hydrated=false parseError=true  layoutChunk={"status":200,"bytes":65536}

2/6 cold starts failed to hydrate (expected: 0)
```

Iteration 6 served a chunk truncated at exactly 65536 bytes (one 64 kB write) and the browser raised
`Invalid or unexpected token` — the same error quoted in the issue.
