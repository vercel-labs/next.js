# Repro: vercel/next.js#82254

Plain `<img />` in the **Pages Router** causes React 19 to emit
`<link rel="preload" as="image">` as the **first child of `<body>`** instead of `<head>`.
The **App Router** emits no preload at all for the same markup.

## Run

```bash
npm install
npm run dev
# then
curl -s http://localhost:3000/pages-router | grep -o '<body>.\{0,120\}'
curl -s http://localhost:3000/app-router  | grep -c 'rel="preload" as="image"'
```

`npm run build && npm start` (or inspecting `.next/server/pages/pages-router.html`) shows the same.

## Observed

Pages Router (`/pages-router`):

```html
<body><link rel="preload" as="image" href="/next.svg"/><div id="__next">...
```

App Router (`/app-router`): `0` matches — no preload link emitted.

Adding `loading="lazy"` to the `<img>` (second image on the page) suppresses the preload.

Verified with next@15.4.5 + react@19.1.0 and next@16.3.1 + react@19.2.8, in `next dev` and `next build`/`next start`.
