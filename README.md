# next.js#57704 reproduction

Minimal reproduction of https://github.com/vercel/next.js/issues/57704
(the reporter's repo `iljamulders/nextjs-i18n-incremental-adopt` is deleted / 404).

App Router route `app/[lang]/about/page.jsx` returns 404 when the Pages Router
`i18n` config is present in `next.config.js`.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/en/about   # 404
curl -i http://localhost:3000/nl/about   # 404
curl -i http://localhost:3000/           # 200 (pages router)
```

Removing the `i18n` block from `next.config.js` makes `/en/about` return 200.
