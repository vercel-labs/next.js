# Repro: vercel/next.js#81148 — `next dev` rewrite to an HTTPS backend with a self-signed certificate fails

Minimal reproduction (no .NET needed) of https://github.com/vercel/next.js/issues/81148.

## Run

```bash
npm install
./gen-certs.sh          # self-signed cert for localhost (stands in for the ASP.NET dev cert)
node api-server.mjs &   # https://localhost:7248/weatherforecast
npx next dev -p 3000
curl -i http://localhost:3000/weatherforecast
```

## Observed

`curl` gets `HTTP/1.1 500 Internal Server Error` and the dev server logs:

```
Failed to proxy https://localhost:7248/weatherforecast [Error: self-signed certificate] { code: 'DEPTH_ZERO_SELF_SIGNED_CERT' }
```

Reproduced with next@15.3.4 and next@16.3.1-canary.26.

## Notes

* `NODE_TLS_REJECT_UNAUTHORIZED=0` does **not** help: `next/dist/compiled/http-proxy`
  sets `rejectUnauthorized = typeof options.secure === 'undefined' ? true : options.secure`
  for https targets, and `proxyRequest` (`next/dist/server/lib/router-utils/proxy-request.js`)
  never passes `secure`, so the flag is always forced to `true`.
* `NODE_EXTRA_CA_CERTS=./certs/cert.pem npx next dev` works, which confirms the failure is
  purely certificate verification in the dev rewrite proxy.
