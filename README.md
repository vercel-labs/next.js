# Repro: aborted request + middleware => uncaughtException in dev (vercel/next.js#84649)

```
npm install
npm run dev     # terminal 1 (with a fresh .next, so the route is not compiled yet)
npm run repro   # terminal 2: sends a complete POST body, then destroys the socket
```

Dev server output:

```
⨯ uncaughtException: Error: aborted
    at ignore-listed frames { code: 'ECONNRESET' }
```

Only happens while `middleware.ts` exists and only for the first (compiling)
request to the route. Delete `middleware.ts` and the same abort is handled
cleanly (`POST /api/hello 200`).

Verified with next@15.6.0-canary.53 and next@16.3.1-canary.26 (Turbopack dev, Node 24).
