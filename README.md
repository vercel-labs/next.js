# Repro: duplicate server-side requests with parallel + intercepting routes

Issue: https://github.com/vercel/next.js/issues/66418

`app/layout.jsx` performs exactly one backend request (`lib/rawRequest.js`, a plain
`node:http` call so Next cannot dedupe it like `fetch`). Because the root layout also
renders a `@modal` parallel slot that contains an intercepting route
(`app/@modal/(.)photo/[id]/page.jsx`), the layout is rendered twice per request and the
backend request is duplicated. Deleting `app/@modal` makes it happen only once.

## Run

```bash
npm install
npm run verify
```

`verify.mjs` starts the counting endpoint and `next dev`, requests `/photo/1` once, and
prints how many backend requests the root layout made. It exits 1 when duplicated.

Manual:

```bash
npm install
node counter-server.js &     # counting endpoint on :4000
npm run dev                  # next dev on :3000
curl http://localhost:3000/photo/1
curl http://localhost:4000/count
```

## Observed

| variant | root layout requests per `GET /photo/1` |
| --- | --- |
| with `app/@modal` | 2 |
| `app/@modal` removed | 1 |

Reproduced with next 14.2.1 in `next dev` and `next build && next start`, and with
next@canary (16.3.1-canary.25).
