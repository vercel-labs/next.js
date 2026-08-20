# Repro: root catch-all route intercepts `/_next/*` and static asset requests

Issue: https://github.com/vercel/next.js/issues/73028

`app/[[...slug]]/page.tsx` (root optional catch-all) is rendered — including
`generateMetadata()` — for requests to non-existent `/_next/**` paths and
browser-requested asset paths, returning HTTP 200 HTML instead of a 404.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
curl -i http://localhost:3000/_next/static/chunks/.env
curl -i http://localhost:3000/apple-touch-icon.png
```

Server log:

```
[REPRO] page component rendered for slug: [ '_next', 'static', 'chunks', '.env' ]
[REPRO] generateMetadata rendered for slug: [ '_next', 'static', 'chunks', '.env' ]
```

Both responses are `200 text/html`. Reproduced with next `16.3.1-canary.25`
in `next dev` and `next start`. Existing real chunks are still served correctly.
