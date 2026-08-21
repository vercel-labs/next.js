# Repro: vercel/next.js#81123 — unsupported `twitter:image:*` tags

`TwitterImageDescriptor` accepts `width`, `height`, `secureUrl` and `type`, and
Next.js renders them as `twitter:image:width` / `twitter:image:height` /
`twitter:image:secure_url` / `twitter:image:type` meta tags. The X (Twitter)
Cards markup spec defines none of those keys, so the type surface + docs
suggest options that have no effect on X cards.

## Run

```bash
npm install
npm run typecheck   # passes: width/height accepted by the Metadata type
npm run build && npm start
curl -s http://localhost:3000 | grep -o '<meta name="twitter:[^>]*>'
```

## Observed (Next.js 16.3.1-canary.26)

```html
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Next.js"/>
<meta name="twitter:image" content="https://nextjs.org/og.png"/>
<meta name="twitter:image:alt" content="Next.js"/>
<meta name="twitter:image:secure_url" content="https://nextjs.org/og.png"/>
<meta name="twitter:image:type" content="image/png"/>
<meta name="twitter:image:width" content="1200"/>
<meta name="twitter:image:height" content="630"/>
```

Expected per https://developer.x.com/en/docs/x-for-websites/cards/overview/markup:
only `twitter:image` and `twitter:image:alt` exist for images.
