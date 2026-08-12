# Repro: `next build` tears `.next/cache/fetch-cache` entries (vercel/next.js#97271)

`FileSystemCache.set` writes FETCH entries through `MultiFileWriter.append`, which is a
plain `fs.writeFile` — no temp file, no atomic rename, no cross-process lock. `next build`
prerenders in multiple worker processes, each with its own `FileSystemCache`, so workers
race writing the same entry file and tear it.

## Run

```bash
npm install
npm run repro
```

`run.mjs` starts a local API on :4321 that returns a ~1.3 MB JSON body with per-response
headers (`age`, `server-timing`, `x-trace`) so concurrent writes for the same key differ in
length, then runs `next build` (300 pages, 5 prerender workers, `cacheMaxMemorySize: 0`,
`revalidate: 1` on a pool of 4 shared fetch URLs), then scans `.next/cache/fetch-cache`.

## Observed (next 16.3.0, 3/3 runs)

The build fails from userland `res.json()`:

```
Error occurred prerendering page "/p/182".
SyntaxError: Bad control character in string literal in JSON at position 392886
Export encountered an error on /p/[id]/page: /p/182, exiting the build.
⨯ Next.js build worker exited with code: 1
```

and `npm run check` finds torn entries, e.g. a longer payload partially overwritten by a
shorter one:

```
TORN(outer) f5e719fe... bytes=1711309 Unexpected non-whitespace character after JSON at position 1711270
  tail: "tp://127.0.0.1:4321/q?2\"},\"revalidate\":1,\"tags\":[]}.1:4321/q?2\"},\"revalidate\":1,\"tags\":[]}"
```

Torn entries that fail the outer parse are swallowed as cache misses; ones that still parse
but whose base64 `body` was spliced surface as a `SyntaxError` in user code.

## standalone-repro.mjs

The reporter's Next-free script (4 processes writing the same entry shape) — `node standalone-repro.mjs`
prints e.g. `{ ok: 10, outerBroken: 177, innerGarbage: 8 }`.
