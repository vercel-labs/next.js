# Reproduction: metadata in `not-found.js` / `error.js` (vercel/next.js#45620)

Next.js 16.3.1, React 19.2.0, App Router.

## Run

```bash
npm install
npm run build
npm start           # http://localhost:3000
npx playwright install chromium
npx playwright test # 1 passes, 3 fail
```

## What happens

`app/layout.js` sets `title.template = '%s | default title'`.

| Case | Expected title | Actual title |
| --- | --- | --- |
| `/does-not-exist` (no matching route) | `Not Found \| default title` | `Not Found \| default title` (works) |
| `/entity/missing` (page calls `notFound()`, page exports `generateMetadata`) — SSR HTML | `Not Found \| default title` | `Not Found \| default title` in HTML, but replaced with `entity missing \| default title` after hydration |
| client-side nav `/` -> `/entity/missing` | `Not Found \| default title` | `entity missing \| default title` |
| `/boom` (page throws, `app/boom/error.js` exports `metadata`) | `Error \| default title` | `default title` — `error.js` metadata is ignored |

So `not-found.js` metadata only sticks when no page metadata was produced; the metadata of the
page that called `notFound()` overrides it on the client (the "title flashes then vanishes"
report), and `error.js` still supports no `metadata` / `generateMetadata` at all.
