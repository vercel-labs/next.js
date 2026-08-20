# next#67036 — ERR_SSL_WRONG_VERSION_NUMBER on middleware fetch to own API route

Middleware fetches `${req.nextUrl.origin}/api/hello`. When the request carries
`x-forwarded-proto: https` (what every TLS-terminating proxy / Vercel / Amplify sends),
`nextUrl.origin` becomes `https://<host>` while the Next server itself only speaks plain
HTTP, so the loopback fetch does a TLS handshake against an HTTP socket and fails with
`ERR_SSL_WRONG_VERSION_NUMBER`. No proxy is needed to reproduce — just send the header.

## Run

```bash
npm install
npm run build
npm start &            # next start -p 3000
# fails (https:// origin)
curl -s -H 'x-forwarded-proto: https' http://localhost:3000/middleware-test
# succeeds (http:// origin)
curl -s http://localhost:3000/middleware-test
```

or `bash repro.sh` (does all of the above).

## Result

next@14.2.4 / 15.5.4 / 16.3.1-canary.25:

```json
{"middlewareFetch":"failed","target":"https://localhost:3000/api/hello",
 "code":"ERR_SSL_WRONG_VERSION_NUMBER",
 "cause":{"library":"SSL routines","reason":"wrong version number"}}
```

next@13.4.12 (the version the reporter says worked): `x-forwarded-proto` is ignored,
`nextUrl.origin` stays `http://localhost:3000`, fetch returns 200.
