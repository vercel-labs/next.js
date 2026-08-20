# Reproduction: issue #48985 — stale build-time fetch data after a new deployment

The reporter's repo (`zartinn/nextjs-vercel-cache-testing`) is deleted (GitHub returns 404),
so this is a minimal self-contained reproduction of the underlying mechanism reported in the
issue and its comments: a build-time `fetch` with a long `revalidate` keeps returning the
response captured by an **earlier build** because the fetch cache lives in `.next/cache`,
which Vercel restores as build cache between deployments.

## Files
- `server.js` — fake upstream API on `http://localhost:3999/api`, returns a new random value on every request.
- `app/page.js` — statically prerendered page that fetches it with `next: { revalidate: 86400 }`.

## Run

```bash
npm install
node server.js &            # upstream
rm -rf .next
npm run build               # build A
grep -o 'id="value">[^<]*' .next/server/app/index.html
npm run build               # build B — .next/cache kept, like Vercel's build cache
grep -o 'id="value">[^<]*' .next/server/app/index.html
npm start                   # serve; page still shows build A's value
```

## Observed (next@16.3.1-canary.25, Node 24)

Build A and build B prerender the **same** value, and the upstream log shows only **one**
request for the two builds — build B reused build A's cached fetch response, so a fresh
deployment serves data from the previous deployment.
