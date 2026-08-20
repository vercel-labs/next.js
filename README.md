# Repro for vercel/next.js#74053 — "default caching flowchart is not correct"

Shows the actual Next.js 15 default `fetch` caching behavior vs. the caching-overview diagram
(which claims `fetch` results are stored in the Data Cache by default).

`origin-server.js` is a local upstream that counts every request that reaches it
(`hits`) and sends `cache-control: no-store`.

## Run

```bash
npm install
node origin-server.js &        # upstream on :3999
npx next build                 # builds /static-a, /static-b (static) and /default (dynamic)
npx next start -p 3000 &
curl -s localhost:3000/default   # repeat 3x
curl -s localhost:3000/static-a
```

## Observed (next@15.5.4, node 24)

- Request-time (`/default`, `force-dynamic`): a plain `fetch(url)` hits the origin on
  **every** request (`hits=8, 9, 10`), so it is **not** stored in the Data Cache.
  The sibling `fetch(url, { cache: 'force-cache' })` on the same page stays frozen
  (`hits=5`, same timestamp) — proving the Data Cache itself works.
- Build time: the same option-less `fetch` **is** written to the Data Cache — `/static-a`
  and `/static-b` fetch the same URL and both render the identical `hits`/timestamp,
  and the value even survives a second `next build` (`.next/cache`).

So the diagram is wrong for request-time rendering but right for build time; the docs need
this build-time-only caveat.
