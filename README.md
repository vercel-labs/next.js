# Repro: missing `Cache-Control` header on `/404` rewrite (next#76168)

```
npm install
npm run build && npm start
curl -I http://localhost:3000/example   # rewritten to /404 -> no Cache-Control header
curl -I http://localhost:3000/not-found # plain 404 -> has Cache-Control
```

Also affected via middleware rewrite: `curl -I http://localhost:3000/mw-example`.

Observed:
- next 15.1.7: rewrite to `/404` returns 404 with **no** `Cache-Control` header.
- next 16.3.1-canary.26: returns `Cache-Control: s-maxage=31536000` (publicly cacheable 404).
- A plain non-existent path returns `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.
