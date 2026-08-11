# Reproduction for vercel/next.js#24952

`url()` references in CSS and `assetPrefix`.

## Setup
- `assetPrefix: '/prefix-a'` in `next.config.mjs`
- `app/globals.css` has `@font-face { src: url("./fonts/Itim-Regular.ttf") }` and a `background-image: url("./fonts/dot.png")`
- `check.mjs` is a Playwright script that prints the network URLs/status of the CSS and font requests.

## Run

```bash
npm install
npx playwright install chromium

# Turbopack (default) dev + prod
npm run dev            # then: node check.mjs http://localhost:3000/ dev-turbopack
npm run build && npm start

# webpack dev + prod
npm run dev:webpack    # then: node check.mjs http://localhost:3001/ dev-webpack
npm run build:webpack && npm start

# grep the emitted CSS
grep -ro 'url([^)]*)' .next/static --include='*.css'
```

## Result on Next.js 16.3.0 — NOT reproducible with `assetPrefix` in next.config

| bundler | emitted CSS url | font request |
| --- | --- | --- |
| webpack (dev + build) | `url(/prefix-a/_next/static/media/Itim-Regular.d6f03444.ttf)` | 200 `/prefix-a/_next/static/media/...` |
| Turbopack (dev + build) | `url(../media/Itim-Regular.2gdp5bji5osxn.ttf)` (relative, inherits prefix from the CSS URL) | 200 `/prefix-a/_next/static/media/...` |

The same holds on Next.js 14.2.35 and even on 10.2.0 (`url(/prefix-a/_next/static/media/Itim-Regular.f70e0…ttf)`),
i.e. config-based `assetPrefix` has always been applied to CSS `url()` references.

## What still does not get a prefix: the deprecated custom-server `app.setAssetPrefix()`

`server.js` reproduces the original report (Express custom server, `app.setAssetPrefix('/prefix-a')`,
no `assetPrefix` in `next.config.mjs`, static requests without the prefix are 404'd):

```bash
npm run build:webpack && npm run custom-server   # http://localhost:3002
```

Then the built CSS contains `url(/_next/static/media/Itim-Regular.d6f03444.ttf)` (no prefix) — but so do the
`<link rel="stylesheet">`/`<script>` tags in the prerendered HTML, because the prefix is only known at runtime,
after the build. Next.js 16 prints:

> ⚠ The `app.setAssetPrefix()` method is deprecated in custom servers. Please configure `assetPrefix` in `next.config.js` instead.

So this is not CSS-specific; it is a limitation of the deprecated runtime API. Configuring `assetPrefix` in
`next.config.js` fixes it for CSS `url()` too.
