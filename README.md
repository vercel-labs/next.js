# Repro for vercel/next.js#70406 — docs CORS middleware example and `NextResponse.json()`

The `middleware.js` in this repo is the CORS example copied verbatim from the docs
(`docs/.../14-middleware.mdx`, "CORS" section), plus a Pages Router API route.

## Run

```bash
npm install
bash verify.sh              # tests next@13.0.0, 13.1.0, 14.2.15 and latest
# or a single version:
npm install next@13.0.0 && npx next dev -p 3000
curl -i -X OPTIONS http://localhost:3000/api/hello -H 'origin: https://acme.com'
```

## Result

| next | `OPTIONS /api/hello` |
| --- | --- |
| 13.0.0 / 13.0.7 | `500 Internal Server Error`, server logs `[Error: A middleware can not alter response's body. Learn more: https://nextjs.org/docs/messages/returning-response-body-in-middleware]` |
| 13.1.0, 14.2.15, 15.x, 16.x | `200 OK` with `access-control-allow-origin/-methods/-headers` and body `{}` |

The `blockUnallowedResponse()` guard that emits that error exists in
`next/dist/server/web/adapter.js` up to 13.0.x and is gone from 13.1.0 onward, so the
documented example is valid on every currently supported release; the reported error only
occurs on Next.js <= 13.0.x.
