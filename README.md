# Repro: headers() returns stale request headers in Proxy after NextRequest.headers mutation (vercel/next.js#97049)

Mirror of https://github.com/r34son/nextjs-proxy-headers-snapshot-regression with the
lockfile removed (original lockfile pinned a non-npmjs registry mirror).

## Run

```bash
pnpm install
pnpm dev
curl http://localhost:3000/
```

## Observed (next@16.3.0-preview.9, 16.3.1-canary.9; dev and `next build && next start`)

```json
{"valueBeforeMutation":null,"valueOnNextRequest":"set-on-next-request","valueFromFirstViewAfterMutation":null,"valueFromSecondViewAfterMutation":null,"sameHeadersObject":true}
```

## Expected (next@16.2.4)

```json
{"valueBeforeMutation":null,"valueOnNextRequest":"set-on-next-request","valueFromFirstViewAfterMutation":"set-on-next-request","valueFromSecondViewAfterMutation":"set-on-next-request","sameHeadersObject":true}
```
