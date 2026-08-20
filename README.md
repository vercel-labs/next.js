# Repro: fallback (root) opengraph-image is dropped when a child page exports `openGraph` metadata

Issue: https://github.com/vercel/next.js/issues/58954 (docs: how to set a fallback OG image in the App Router)

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
curl -s http://localhost:3000/about   | grep 'og:image'   # inherited root image  ✅
curl -s http://localhost:3000/contact | grep 'og:image'   # NO og:image           ❌
curl -s http://localhost:3000/blog    | grep 'og:image'   # NO og:image           ❌
curl -s http://localhost:3000/docs    | grep 'og:image'   # inherited root image  ✅
```

## Result (Next.js 16.3.1, dev and production)

- `app/opengraph-image.tsx` IS inherited by nested routes that do not export an `openGraph` metadata object (`/about`, `/docs` — `/docs` exports only `title`).
- Any page exporting `metadata.openGraph` (even just `openGraph.title` or `openGraph.description`) loses the inherited file-based image entirely: no `og:image`/`twitter:image` tags are emitted (`/contact`, `/blog`).

So a root `opengraph-image` does work as a site-wide fallback, but only for pages that never declare their own `openGraph` object. The docs page for `opengraph-image` does not mention either the inheritance or this override caveat.
