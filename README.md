# Repro attempt: "Proxy rewrites don't work since NextJS@13" (vercel/next.js#42688)

Minimal `next.config.js` rewrite that proxies `/api/:path*` to an external HTTPS
destination, plus a client-side `fetch('/api/todos/1')` on the index page.

## Run

```bash
npm install
npm run dev            # proxies to https://jsonplaceholder.typicode.com
curl -i http://localhost:3000/api/todos/1
# open http://localhost:3000 and read the <pre id="out"> output
```

Point it anywhere with `DEST=https://your-host npm run dev`.

## Result on next@canary (16.3.1-canary.25, Node 24)

`HTTP/1.1 200` through the rewrite; the dev server logs no `Failed to proxy` /
`ECONNRESET`. Same result against nextjs.org, api.github.com, www.google.com,
vercel.com, httpbin.org, and a local self-signed HTTPS upstream (including one
with `keepAliveTimeout = 500ms`, and with aborted client requests).
The proxy forwards `Host: <destination>` and `X-Forwarded-Host: localhost:3000`.

## Only failure mode found: HTTP/2-only upstream

`node upstream/h2-server.js` starts an HTTPS upstream with
`ALPNProtocols: ['h2']` on :8444. Rewriting to `https://localhost:8444` returns
`403 Missing ALPN Protocol, expected 'h2' to be available.` — the Next.js rewrite
proxy speaks HTTP/1.1 only, so a destination that a browser reaches over HTTP/2
can fail when proxied. Run it with
`NODE_EXTRA_CA_CERTS=./upstream/cert.pem DEST=https://localhost:8444 npm run dev`
(generate certs: `openssl req -x509 -newkey rsa:2048 -nodes -keyout upstream/key.pem -out upstream/cert.pem -days 365 -subj /CN=localhost`).
