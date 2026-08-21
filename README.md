# Repro: next/image serves stale optimized image in `next dev` after file edit (same filename)

Issue: https://github.com/vercel/next.js/issues/93075 (next 16.2.4)

The reporter's linked repo (Austin1serb/next.js-minimal-build) contains no image code, so this is a minimal rewrite.

## Run

```bash
npm install
npm run dev
# 1) prime the cache (red image)
curl -s "http://localhost:3000/_next/image?url=%2Ftest.png&w=640&q=75" | md5sum
# 2) edit the file contents, same filename
cp blue.png public/test.png
# 3) next/image is still the old (red) bytes, X-Nextjs-Cache: HIT
curl -si "http://localhost:3000/_next/image?url=%2Ftest.png&w=640&q=75" | grep -i x-nextjs-cache
curl -s  "http://localhost:3000/_next/image?url=%2Ftest.png&w=640&q=75" | md5sum
# 4) the plain static file is updated (blue)
curl -s "http://localhost:3000/test.png" | md5sum
```

Or open http://localhost:3000 : `next/image` stays red while the plain `<img>` turns blue.

## Observed

- optimized response md5 unchanged after the source file changed, `X-Nextjs-Cache: HIT`
- entry persists in `.next/dev/cache/images/<key>/14400.<expire>...` (4h minimumCacheTTL); survives a dev-server restart
- `images.minimumCacheTTL: 0` does NOT help: responses become `X-Nextjs-Cache: STALE` but still return the old bytes on every subsequent request
- workaround: rename the file or delete `.next`
