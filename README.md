# Repro harness for vercel/next.js#49216

App Router route handlers that return an image (streamed or buffered), consumed by `next/image`,
in both `nodejs` and `edge` runtimes, with and without a dynamic route segment.

Run:
```
npm install && npm run build && npm start   # local
# or deploy to Vercel, then:
curl -s -o /dev/null -D- "$HOST/_next/image?url=%2Fapi%2Fedge-dynamic%2Fabc&w=256&q=75"
```

Result on Next 16.3.1-canary.25 deployed to Vercel: every case returns 200 image/jpeg through
`/_next/image`, except `/api/edge-notype/[slug]` which intentionally omits `content-type`
and yields 400 INVALID_IMAGE_OPTIMIZE_REQUEST.
