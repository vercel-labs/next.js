# Repro: `DOMException [OperationError]` / `Cipher job failed` (vercel/next.js#75423)

Deterministic reproduction of the error reported in
https://github.com/vercel/next.js/issues/75423:

```
DOMException [OperationError]: The operation failed for an operation-specific reason
    at AESCipherJob.onDone (node:internal/crypto/util:653:19) {
  digest: '3341694516',
  [cause]: [Error: Cipher job failed]
}
```

## Run

```bash
npm install
npm run repro
```

## What it does

The only AES cipher job Next.js performs on the server is the AES-GCM
encryption/decryption of **Server Action bound (closure) args**
(`next/dist/server/app-render/encryption-utils.js`). `app/page.tsx` contains an
inline `'use server'` action that closes over a variable, so its bound args are
encrypted into the RSC payload on every render.

`repro.mjs` starts **two `next start` instances of the same build** with
different `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` values, then replays the
encrypted closure payload rendered by instance A to instance B, exactly like a
browser (or a crawler replaying a stale/CDN-cached page) would:

```
--- POST instance A (same key that encrypted): HTTP 200
1:"action ran with: bound-closure-value"

--- POST instance B (different key): HTTP 500
1:E{"digest":"3341694516"}
```

`logs/instance-b-key-b.log` then contains the exact `DOMException
[OperationError]` / `[cause]: [Error: Cipher job failed]` stack from the issue,
with a React `digest` and an HTTP 500 – the same signature the reporters see.

The same divergence happens in production without any env var when the
encryption key baked into the build (`server-reference-manifest.json`
`encryptionKey`) differs between the payload the client/crawler holds and the
instance that receives the request: e.g. an old deployment's HTML/RSC payload
(CDN, ISR or browser cached) replayed against a new deployment, or instances
built separately per region.

## Notes

* Still reproduces on `next@15.5.4` (same digest, same `Cipher job failed`
  cause, HTTP 500); Next 15 only prints it as `⨯ [Error [OperationError] ...]`.
* 3000 concurrent `GET /` requests (half with the Googlebot UA) against the
  same page produced **zero** failures, so the render-time *encryption* path
  does not fail on its own – only the *decryption* of a payload encrypted with a
  different key does.
* Nothing in this repro is Googlebot specific; the issue's "only Googlebot"
  correlation could not be reproduced without Google's crawler.
