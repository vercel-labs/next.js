# Repro harness for vercel/next.js#64002 — `await request.formData()` hangs on Vercel

App Router route handlers that `await request.formData()`, plus a JSON control route and an
Edge-runtime variant, with client scripts that exercise buffered and chunked/streamed uploads.

## Run

```bash
npm install
npm run dev                        # or: npm run build && npm start
node scripts/upload.mjs http://localhost:3000 16
node scripts/upload.mjs http://localhost:3000 5000000
node scripts/chunked.mjs http://localhost:3000 /api/upload 800
```

Against a deployment: replace the base URL with the deployment URL.

Routes:
- `POST /api/upload` — Node runtime, `await request.formData()`
- `POST /api/upload-edge` — Edge runtime, `await request.formData()`
- `POST /api/upload-json` — control, `await request.json()`

`scripts/upload.mjs <baseUrl> [sizeBytes]` sends a multipart body then an equivalent JSON body
(30s abort). `scripts/chunked.mjs <baseUrl> [path] [delayMs]` sends multipart with
`Transfer-Encoding: chunked`, trickled in three writes.

## Observed (2026-02, this harness)

No hang. Both `next@14.1.4` (the reported version) and `next@16.3.1` returned 200 on Vercel for
16 B and 5 MB multipart bodies and for chunked/trickled bodies, on Node and Edge runtimes;
`formData()` parse time tracked `json()` parse time. Node 18.20.4 and Node 24 clients both fine.
