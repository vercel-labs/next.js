# Repro: next.js#38863 — POST to a page returns 200 in `next dev` but 405 in `next start`

```sh
npm install
npm run repro
```

`repro.mjs` starts `next dev` on :3000, then builds and starts `next start` on :3001,
and prints the status codes for GET/POST `/`.

Observed with next@16.3.1-canary.25 (Node 24):

```
{ devGET: 200, devPOST: 200, prodGET: 200, prodPOST: 405 }
```

Production sends `405 Method Not Allowed` with `Allow: GET` / `Allow: HEAD`;
dev renders the page with `200 OK`.
