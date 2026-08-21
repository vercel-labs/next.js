# Repro for vercel/next.js#86983 — blank page + 404 `_next/static/chunks/...` (app router, `output: 'export'`)

The original report ("random, irreproducible") is a **deployment/cache skew** failure and it is
100% deterministic once you serve HTML from build N-1 next to assets from build N — which is what a
CDN or a browser disk cache does for a few minutes/hours after every `output: 'export'` deploy.

```
npm install
npx playwright install chromium
npm run repro
```

What the script does:

1. `next build --webpack` (static export) with `VERSION_ONE` client component -> `out-v1`
2. changes the client component -> `next build` again -> `out-v2`
   (`static/chunks/app/page1/page-<hash>.js` gets a new content hash, the old file no longer exists)
3. starts `server.js`: HTML/RSC payloads come from `out-v1`, `/_next/*` comes from `out-v2`
4. Playwright loads `/` (works) and clicks the `<Link>` to `/page1/`

Observed, deterministic on every run:

```
[pageerror] ChunkLoadError: Loading chunk 539 failed.
url: http://localhost:3123/page1/
failed requests: [ '404 .../_next/static/chunks/app/page1/page-<oldhash>.js' ]
```

* next@16.1.0-canary.16 -> `visible text: "Application error: a client-side exception has occurred ..."`
  (white page, exactly the "blank page" of the report)
* next@16.3.1-canary.26 -> `visible text: "This page couldn't load / Reload to try again, or go back."`

In both cases the client-side navigation is dead until the user reloads enough times for the stale
HTML/build manifest to be evicted from the cache ("after 20 refreshes it is somehow repaired").
There is no automatic fallback to a hard (MPA) navigation on a missing chunk:
`grep -r ChunkLoadError node_modules/next/dist/client` is empty.

A *hard* load of the stale `/page1/index.html` is not blank (prerendered HTML shows) but never
hydrates - only client-side navigation produces the broken/blank screen.

The `webpack: config.output.chunkFilename = 'static/chunks/[name]-[contenthash].js'` override from the
issue is *not* the cause; Next's own default is `static/chunks/[name].[contenthash].js`.
