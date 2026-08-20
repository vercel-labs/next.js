# Repro: next/image converts alpha WebP to JPEG with black background (#35674)

Next.js 16.3.1. When the request has no `image/webp` in `Accept`
(Safari <14, crawlers, CDNs stripping Accept), `/_next/image` falls back to
`image/jpeg` even when the source WebP has an alpha channel, so transparency
becomes black.

## Run

```bash
npm install
npm run build
npm run start &      # logs a Next.js production server on :3000
npm run verify       # requests /_next/image with and without webp in Accept
```

## Observed (npm run verify)

```
accept: image/webp,image/*,*/*
  content-type: image/webp
  format: webp hasAlpha: true channels: 4
  top-left pixel: [0,0,0,0]        <- transparent
accept: image/png,image/*,*/*
  content-type: image/jpeg
  format: jpeg hasAlpha: false channels: 3
  top-left pixel: [0,0,0]          <- black, transparency lost
```

Expected: fall back to `image/png` (or keep alpha) when the source image has an
alpha channel.

Source: `node_modules/next/dist/server/image-optimizer.js` — the fallback is
unconditionally `contentType = JPEG` when no supported mime type is negotiated
and the upstream type is WEBP/AVIF.
