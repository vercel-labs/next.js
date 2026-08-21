# Reproduction: vercel/next.js#85810 — large request body truncated behind a Node.js `proxy.js`

The repo linked in the issue (`needle-ai/needle-mcp`) is an unrelated Python MCP
server, so this is a minimal standalone reproduction.

## What it shows

With `output: 'standalone'` and a **Node.js-runtime `proxy.js`** that reads the
request body, the downstream App Route / Server Action can observe the *original*
`IncomingMessage` before Next.js restores the buffered clone, so the body is
empty/truncated:

* `POST /api/echo` → `500 TypeError: Response body object should not be disturbed or locked`
* `POST /action` (Server Action) → `500 SyntaxError: Unexpected end of JSON input`

Root cause (Next 16.0.1, `next/dist/server/next-server.js`):

```js
} finally {
  if (hasRequestBody) {
    requestData.body.finalize()   // <-- not awaited
  }
}
```

`finalize()` is async (it awaits the request `end` event and then swaps the
request body for the buffered clone). Because it is not awaited, the route /
action handler can start reading the request body first. Fixed upstream by
PR #85418 (`await requestData.body.finalize()`), verified present in `next@16.3.1`.

## Run

```bash
./run.sh              # next 16.0.1, standalone, FINALIZE_DELAY_MS=300 (default)
```

`scripts/amplify-finalize.mjs` makes `finalize()` resolve one macrotask later so
the race is deterministic instead of load/timing dependent. `FINALIZE_DELAY_MS=0`
(a single `setTimeout(…, 0)` tick) already fails on 16.0.1 — that is how thin the
window is; real deployments (standalone/Docker, bun/node, slow uploads) lose it
intermittently.

Control:

```bash
npm pkg set dependencies.next=16.3.1 && rm -rf .next node_modules && ./run.sh
# → 200 with the full body for every size, even with FINALIZE_DELAY_MS=300
```

Switching the file back to edge-runtime `middleware.js` also avoids it, matching
the issue comments.
