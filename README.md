# Repro: `getStaticProps` redirect never applied when the ISR memory cache is too small (vercel/next.js#39704)

`/test` is an ISR page (`revalidate: 1`). After `/api/enable` is hit, `getStaticProps` returns
`{ redirect: { destination: '/', permanent: false } }`, but the previously prerendered HTML keeps
being served with `200` forever.

Trigger: a memory cache too small to hold the `REDIRECT` cache entry
(`experimental.isrMemoryCacheSize` in Next 12, `cacheMaxMemorySize` in Next >= 14.1 — the value is
**bytes**, so the reporter's `50` is 50 bytes). `REDIRECT` entries are only stored in the in-memory
LRU (`server/lib/incremental-cache/memory-cache`); the filesystem cache never persists them, so when
the LRU rejects/evicts them the stale on-disk page is served on every subsequent request.

## Run

```bash
npm install
npm run build
npm start &            # logs "Single item size exceeds maxSize" on each revalidation
./repro.sh
```

Observed: `200` on every request, forever. Server log repeats `Single item size exceeds maxSize`.

Expected (and what happens with `next.config.js` = `module.exports = {}` or
`cacheMaxMemorySize: 5000`): `307 -> /` after revalidation.
