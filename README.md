# Repro: issue #68998 — `&amp;` in `<link rel="preload" imageSrcSet>` for priority images

## Run

```bash
npm install
npm run build
npm run start        # http://localhost:3000
curl -s localhost:3000 | grep -o '<link rel="preload" as="image"[^>]*>'
```

## Observed (next@16.3.1-canary.25 and next@15.0.0-canary.118)

Raw HTML source contains HTML-escaped ampersands (React server escaping of attribute values):

```html
<link rel="preload" as="image" imageSrcSet="/_next/image?url=...&amp;w=640&amp;q=75 1x, ...&amp;w=1200&amp;q=75 2x"/>
```

Requesting that literal string (as a non-HTML-aware consumer such as Google Search Console does) returns 400:

```bash
curl -i 'http://localhost:3000/_next/image?url=https%3A%2F%2Fplacehold.co%2F600x400%2Fpng&amp;w=640&amp;q=75'
# HTTP/1.1 400 Bad Request -> "w" parameter (width) is required
```

With plain `&` the same URL returns 200.

## Browser behavior

`node check.mjs` (Playwright, requires the server on :3001) shows Chromium decodes the entity and
requests `...&w=640&q=75` → 200. So the escaping only breaks consumers that do not decode HTML
entities; a URL-encoded (`%26`) or entity-free srcset would avoid it.
