# Repro harness for vercel/next.js#39713 — "Middleware fetch requests do not work (POST, GET)"

The reporter's linked repo (ornakash/reproduction-template-nextjs @ b67621d) no longer
contains any `fetch()` call in `middleware.ts`, so this harness recreates the reported code.

`middleware.js` exercises three cases on `/`:
1. `await fetch(...)` + `await res.json()` (GET)
2. fire-and-forget `fetch(...).then(r => r.json())` (original report style)
3. `await fetch(...)` POST with JSON body

## Run

```
npm install
npm run dev     # then: curl http://localhost:3000/
npm run build && npm start
```

## Result (verified)

All three cases succeed; no `TypeError: Cannot delete property 'Symbol(set-cookie)'`
and no hang. Server log prints:

```
MIDDLEWARE AWAIT JSON OK 200 true 10
MIDDLEWARE POST OK 200
MIDDLEWARE FIRE-FORGET JSON OK 10
```

Verified on next@16.3.1-canary.25 (dev+Turbopack and `next build`/`next start`),
and also on next@12.2.6 with Node 16.14.0 and Node 24 (Linux) using the exact
middleware code from the issue body — the reported error did not occur.
