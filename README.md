# Repro: next.js#50166 — `TypeError: Response body object should not be disturbed or locked`

App Router Route Handler POST fails when the request body stream was already consumed by
the custom server (Firebase Cloud Functions, `express.json()`, body-parser, tRPC adapters...).

## Run

```bash
npm install
npm run build
npm start                       # custom server on :3000 (NODE_ENV=production)
curl localhost:3000/api                                                              # 200 OK
curl -X POST localhost:3000/api -H 'content-type: application/json' -d '{"a":1}'     # 500
```

Dev mode: `node server.js` (same failure).

Server log:

```
⨯ TypeError: Response body object should not be disturbed or locked
    at ts.fromNodeNextRequest (...)
```

Removing `server.use(express.json())` from `server.js` makes the POST succeed, which is why
Firebase Functions (which always pre-parses the body) breaks.
