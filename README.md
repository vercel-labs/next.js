# Repro: next.js#76835 — multiple sitemaps are served under a spec-violating path

`app/product/sitemap.ts` with `generateSitemaps()` is served at
`/product/sitemap/0.xml` … `/product/sitemap/3.xml`.

Per https://www.sitemaps.org/protocol.html#location a sitemap may only contain
URLs whose paths are at or below its own directory, i.e. a sitemap at
`/product/sitemap/0.xml` may only list `/product/sitemap/...` URLs — so the
`/product/...` URLs it actually lists are out of scope and ignored by crawlers.
A spec-safe shard path would be e.g. `/product/sitemap-0.xml`.

## Run

```bash
npm install
npm run dev
curl -s http://localhost:3000/product/sitemap/0.xml   # 200, lists /product/1
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/product/sitemap-0.xml # 404-ish (html)
```

Also on next@16 canary: the `id` argument is a Promise while the docs type it as
`number`, so the docs' example (`Number(id)`) yields an empty `<urlset>` and
`next build` fails type checking.
