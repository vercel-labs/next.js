# Repro: @next/third-parties GoogleTagManager / GoogleAnalytics scripts land in <body>, not <head>

Upstream issue: https://github.com/vercel/next.js/issues/67567

`app/layout.tsx` renders `<GoogleTagManager />` and `<GoogleAnalytics />` as the first
children of `<html>`, exactly as the docs show.

## Run

```bash
npm install
npm run build
npm start            # http://localhost:3000
node check.mjs http://localhost:3000   # requires: npm i -D playwright && npx playwright install chromium
```

## Observed (Next 16.3.1, @next/third-parties 16.3.1; same on 14.2.4)

- Server HTML `<head>` contains only `<link rel="preload" as="script" href="https://www.googletagmanager.com/gtm.js?id=...">`
  and the equivalent gtag preload. There is **no** GTM/GA `<script>` and no `dataLayer` snippet in the SSR markup.
- After hydration, `next/script` (`afterInteractive`) appends `#_next-gtm`, `#_next-ga-init` and `#_next-ga`
  to `<body>`; `document.head.querySelector('script[src*="googletagmanager"]')` is `null`.
- Google's install instructions (and Google Search Console GTM/GA site verification) require the
  container snippet in `<head>`, which is why verification fails.
