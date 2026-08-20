# Reproduction for vercel/next.js#63402 — `request.url` / `request.nextUrl` ignore the proxy host

Mirror/repair of https://github.com/apfelbox/reproducer-invalid-next-host (which needs an
external reverse proxy). This version ships a 20-line proxy so it is self-contained.

## Run (dev)

```bash
npm install
npm run dev      # Next.js on :3000
npm run proxy    # reverse proxy on :4000 -> :3000
curl -s http://localhost:4000/test
```

## Run (production)

```bash
npm run build && npm run start
npm run proxy
curl -s http://localhost:4000/test
```

## Observed (next@canary, dev and next start)

```json
{
  "request.url": "https://localhost:3000/test",
  "request.nextUrl.href": "https://localhost:3000/test",
  "request.nextUrl.host": "localhost:3000",
  "headers": { "host": "proxy.example.com", "x-forwarded-host": "proxy.example.com", "x-forwarded-proto": "https" }
}
```

`x-forwarded-proto` **is** honoured (scheme becomes `https`), but the host is always the
internal listen address: neither the `Host` header nor `x-forwarded-host` is used.

## Expected

`https://proxy.example.com/test`.
