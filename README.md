# Repro: `output: export` emits `.txt` files (issue #57419)

Undocumented `.txt` artifacts produced by a static export of the App Router.

```bash
npm install
npm run build      # writes ./out
find out -name '*.txt' | sort
npx serve out -l 3000   # then hover/click the "About" link and watch the network tab
```

Observed with next 16.3.1: each route gets `<route>.txt` plus segment-prefetch files
`__next._tree.txt`, `__next._full.txt`, `__next.<segment>.__PAGE__.txt`. They contain the
React Server Components (Flight) payload and are fetched by the client router when a
`next/link` is prefetched or clicked (e.g. `GET /about/__next._tree.txt?_rsc=...`).
