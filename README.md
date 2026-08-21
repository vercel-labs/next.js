# Repro: `res.setHeader()` after `handle(req, res)` in a custom server (next#82387)

`next` 14.2.14, `fastify` 4.11.0, Node 20+.

```bash
npm install
npm run repro
```

Two Fastify routes call the same Next request handler:

- `/after/x` — `await handle(req.raw, reply.raw)` then `reply.raw.setHeader('Set-Cookie', ...)`
- `/before/x` — `setHeader` first, then `await handle(...)`

Observed (Next 14.2.14):

```
setHeader AFTER handle() -> null
setHeader BEFORE handle() -> sessionId=abc123; Max-Age=2592000
```

After `handle()` resolves, `reply.raw.headersSent === true` and `writableEnded === true`, so the
late header is dropped. Next.js also replaces `res.setHeader` with a patched function that swallows
`ERR_HTTP_HEADERS_SENT`, so the drop is silent (plain Node throws in the same situation).

Cross-version check with the identical server: the late `setHeader` never lands on 12.0.10, 12.3.4,
14.2.14 or 15.5.4. On 12.0.10 it throws `ERR_HTTP_HEADERS_SENT`; on 13+/14+/15 it fails silently.
So the timing requirement (set headers *before* calling `handle`) is not new, but the silent failure
is — which is what the docs request in the issue is about.
