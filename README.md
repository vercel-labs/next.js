# Repro: default `'use cache'` is not persisted on Vercel for dynamic routes (next#85240)

Next 16.1.1, `cacheComponents: true`.

- `app/[locale]/page.jsx` — `'use cache'` (default handler), 1s sleep, prints a random `render-id`.
- `app/[locale]/remote/page.jsx` — `'use cache: remote'`, otherwise identical.

## Run

```bash
npm install
npm run build && npm start
# local: every request to /en-us is instant and render-id is stable (cache hit)
curl -s -w '%{time_total}\n' -o /dev/null http://localhost:3000/en-us

# then deploy to Vercel and repeat:
# /en-us          -> ~1.1s every request, new render-id each time (cache miss)
# /en-us/remote   -> ~0.07s after first request, stable render-id (cache hit)
```
