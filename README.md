# Repro: `uncaughtException: Error: aborted` (ECONNRESET) when SSE client disconnects

Issue: https://github.com/vercel/next.js/issues/56529

Next.js `16.3.1-canary.25`, Node 24.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
# in another shell:
./repro.sh             # streams /api/sse then SIGKILLs curl (abrupt client disconnect)
```

Or open http://localhost:3000 and reload the page (the client aborts the POST stream on unmount).

## Result

Server console prints, after the client goes away:

```
Error: aborted
    at ignore-listed frames { code: 'ECONNRESET' }
⨯ uncaughtException: Error: aborted
    at ignore-listed frames { code: 'ECONNRESET' }
```

## Narrowing

| route             | runtime | method            | uncaughtException |
|-------------------|---------|-------------------|-------------------|
| `/api/sse`        | edge    | POST (with body)  | yes               |
| `/api/sse`        | edge    | GET               | no                |
| `/api/sse-node`   | nodejs  | POST (with body)  | no                |

So it is specific to the Edge runtime handling a request that has a body when the
client aborts mid-stream. Happens in both `next dev` and `next start`.
