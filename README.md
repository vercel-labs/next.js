# Repro for vercel/next.js#67375 — `<Link prefetch={false}>` still issues an RSC request to a same-origin URL outside the app

Two independent Next.js App Router apps served behind one origin:
- app A on :3001 (proxied at `http://localhost:3000/`)
- app B on :3002 with `basePath: '/b'` (proxied at `http://localhost:3000/b`)

App A renders `<Link prefetch={false} target="_self" href="http://localhost:3000/b/page-b">`.
Because the href is same-origin, `next/link` treats it as an internal route: clicking it fires
`GET /b/page-b?_rsc=...` with `RSC: 1` and app A's `Next-Router-State-Tree` header at app B,
then falls back to a full document navigation. The RSC request is useless and, when the other
app cannot handle app A's router state tree, it errors (500 in the reporter's real app).

## Run

```bash
npm i
(cd app-a && npm i && npx next build && npx next start -p 3001 &)
(cd app-b && npm i && npx next build && npx next start -p 3002 &)
node proxy.js &            # logs every proxied request + RSC / Next-Router-State-Tree headers
npx playwright install chromium
node check-network.js
```

## Observed (next 14.2.4 and 16.3.1-canary.25)

```
GET http://localhost:3000/b/page-b?_rsc=1iwkq  rsc=1  next-router-state-tree=<app A tree>  (fetch)
GET http://localhost:3000/b/page-b                                                          (document)
```

Expected: no RSC request for a link that is not part of this app / with `prefetch={false}`.
