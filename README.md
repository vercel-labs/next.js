# Repro: vercel/next.js#87779

Request URLs are normalized in the web adapter (`normalizeRscURL`) despite
`skipProxyUrlNormalize` / `__NEXT_NO_MIDDLEWARE_URL_NORMALIZE`.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/test.rsc
```

## Expected

`proxy.ts` logs the raw path `/test.rsc`.

## Actual

```
[proxy] pathname=/test url=http://localhost:3000/test
```

The `.rsc` suffix is stripped before the proxy runs. In
`next/dist/server/web/adapter.js` the first statement of `adapter()` is
`params.request.url = normalizeRscURL(params.request.url)`, which is not guarded
by `process.env.__NEXT_NO_MIDDLEWARE_URL_NORMALIZE` (unlike the checks later in
the same function). basePath is correctly preserved with the flag, showing the
flag is otherwise wired.
