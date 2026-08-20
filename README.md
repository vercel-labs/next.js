# Repro: vercel/next.js#48619 — app dir `[locale]` route 404s when pages `i18n` is enabled

App Router route `app/[locale]/page.js` returns 404 for `/en` and `/fr` whenever
`i18n` is configured in `next.config.js` (the config is only meant for the Pages
Router). A Pages Router route (`pages/login.js`) keeps working.

## Run

```bash
npm install
npm run build && npm start
curl -i http://localhost:3000/en   # 404 (expected 200 "Current locale: en")
curl -i http://localhost:3000/login # 200
```

`npm run dev` behaves the same on current canary.

Comment out the `i18n` block in `next.config.js`, rebuild, and `/en` returns 200.
