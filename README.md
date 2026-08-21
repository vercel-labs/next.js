# Repro: canonical link from async `generateMetadata` is streamed, not in the initial HTML `<head>`

Issue: https://github.com/vercel/next.js/issues/80868

Next.js: `next@canary` (verified on 16.3.1-canary.26)

## Run

```bash
npm install
npm run build
npm start
```

## Observe

```bash
# Googlebot (NOT in the default htmlLimitedBots list) -> canonical is streamed
curl -sN -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  "http://localhost:3000/p/widget?variant=red" | sed -n '1,1p' | grep -c canonical
# => 0 : the flushed shell <head> has no <link rel="canonical">;
#         it arrives ~1s later, after </head>, injected by React from the body stream.

# Bingbot (IS in the default htmlLimitedBots list) -> blocking metadata
curl -sN -A "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)" \
  "http://localhost:3000/p/widget?variant=red" | grep -o '<link rel="canonical"[^>]*>'
# => <link rel="canonical" href="https://example.com/p/widget"/> inside <head>
```

`app/p/[slug]/page.tsx` has an async `generateMetadata` (1s simulated API call) that sets
`alternates.canonical` to the path without query params.

## Related

Exporting both `metadata` and `generateMetadata` from the same segment (the workaround the
reporter asks for: static canonical + dynamic title) fails the build with:

```
"metadata" and "generateMetadata" cannot be exported at the same time, please keep one of them.
```
