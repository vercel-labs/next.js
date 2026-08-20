# Repro harness for vercel/next.js#60473 — "Memory leak in optimizeCss"

The reporter's CodeSandbox devbox (`old-currying-xtd57t`) is not publicly fetchable, so this is a
minimal standalone harness that measures server memory while `experimental.optimizeCss` (Critters)
post-processes HTML under load.

## Contents
- `next.config.js` – `experimental.optimizeCss: true` (flip to `false` for the baseline run)
- `styles/big.css` – 3000 rules so Critters has real work to do
- `pages/ssr.js` – `getServerSideProps` page: the only route that runs `postProcessHTML` per request
- `pages/p/[id].js`, `pages/isr.js` – SSG / ISR pages (served from the prerender cache)
- `pages/api/mem.js` – forces `global.gc()` twice and reports `heapUsed` / `rss`
- `scripts/load.mjs` – fires N requests per round and prints post-GC memory after each round

## Run
```bash
npm install
npm run build
npm start                 # needs --expose-gc, provided by the start script
npm run load              # 12 rounds x 1000 requests to /ssr, concurrency 20
```

## Measured result (Next.js 16.3.1-canary.25, Node 24.17, Linux)
`optimizeCss: true`, 12,000 requests to `/ssr`:
heapUsed 24.2 MB -> 24.6 MB, rss 154 MB -> ~402 MB and then flat (plateau after round 1).

`optimizeCss: false`, same load: heapUsed ~22 MB flat, rss ~290 MB.

Next.js 13.5.6 (the reported version, critters 0.0.16): heapUsed 31.7 MB -> 31.9 MB over 5,000
requests, rss plateaus around 500 MB.

So the post-GC JS heap does not grow: the extra memory is a one-time allocator/RSS overhead from
Critters (which also costs ~35 ms per request), not unbounded growth. SSG pages (`/p/0`) are served
straight from prerendered HTML (1500 requests in ~1.9 s, no Critters work), so the reporter's stated
trigger ("pages are SSG") does not invoke Critters at runtime in either version.
