# Repro: `fetch(new Request(url, { body }))` drops `Content-Length` in Next.js production server

Issue: https://github.com/vercel/next.js/issues/66840

## What it shows

An echo server on port 4000 logs the `content-length` / `transfer-encoding` of every
inbound request. The Next.js app performs the same POST twice:

- `fetch(url, options)` -> `Content-Length: 25`
- `fetch(new Request(url, options))` -> no `Content-Length`, `Transfer-Encoding: chunked`

Plain Node.js (no Next.js) sends `Content-Length: 25` for both, so this is
Next.js' patched `fetch`. Only reproduces with `next build && next start`
(`next dev` is fine).

## Run

```bash
npm install
node echo-server.mjs &          # echo server on :4000, prints received headers
npm run build && npm start &    # Next.js on :3000
curl -s http://127.0.0.1:3000/render > /dev/null   # fetches during render
node click.mjs                  # clicks both server-action buttons on /
```

Then read the echo server output. Expected (bug):

```
{"url":"/render","content-length":"25","transfer-encoding":null,...}
{"url":"/render?req-object","content-length":null,"transfer-encoding":"chunked",...}
{"url":"/api","content-length":"25","transfer-encoding":null,...}          <- fetch(url, options)
{"url":"/api","content-length":null,"transfer-encoding":"chunked",...}     <- fetch(new Request(...))
```

`node baseline.mjs` prints the plain-Node.js behaviour for comparison (both requests
carry `Content-Length`).

Verified with next@16.3.1-canary.25, Node v24.17.0.
