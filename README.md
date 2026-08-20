# Repro: `next dev --experimental-https` cert does not cover the printed Network URL

Upstream issue: https://github.com/vercel/next.js/issues/73913

## Run

```bash
npm install
npm run verify   # boots `next dev --experimental-https` and TLS-probes both printed URLs
```

`verify.mjs` writes the dev server output to `dev-https.log`.

## Expected

Both URLs Next.js prints (`Local:` and `Network:`) should be served with a certificate
the mkcert root CA validates.

## Actual

`next dev --experimental-https` generates a certificate whose SAN list is exactly
`DNS:localhost, IP:127.0.0.1, IP:::1`, but it still advertises
`Network: https://<LAN-IP>:3000`. Hitting that URL fails TLS hostname validation:

```
--- certificate SANs ---
X509v3 Subject Alternative Name:
    DNS:localhost, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
--- TLS probes (mkcert rootCA trusted) ---
https://localhost:3000   -> HTTP 200
https://100.64.250.98:3000 -> ERR_TLS_CERT_ALTNAME_INVALID: Hostname/IP does not match certificate's altnames: IP: 100.64.250.98 is not in the cert's list: 127.0.0.1, ::1
```

Chromium (Playwright, mkcert root CA installed in the NSS store) shows the same:
`https://localhost:3000` loads with HTTP 200, `https://<LAN-IP>:3000` fails with
`net::ERR_CERT_COMMON_NAME_INVALID`.

## Cause

`createSelfSignedCertificate()` in `packages/next/src/lib/mkcert.ts` only ever passes
`['localhost', '127.0.0.1', '::1']` (plus an explicit `-H <host>`) to mkcert, so the LAN
address that `next dev` itself prints as the Network URL is never in the SAN list.

## Workaround (also proves the cause)

```bash
next dev --experimental-https -H <your-LAN-IP>
```
adds `IP Address:<LAN-IP>` to the SAN list, and the network URL then returns HTTP 200.
