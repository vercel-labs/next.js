# Reproduction for vercel/next.js#51009

App Router routes under a dynamic segment return 404 when the (Pages-Router-only)
`i18n` config is present in `next.config.js`.

```bash
npm install
npm run dev
curl -i http://localhost:3000/de/broken     # 404 (expected 200 JSON {"lang":"de"})
curl -i http://localhost:3000/de/favorite   # 404 (expected 200 page)
curl -i http://localhost:3000/              # 200
```

Same result with `npm run build && npm run start`.
Delete the `i18n` block from `next.config.js` and both URLs return 200.

Server log shows the locale prefix being stripped before App Router matching:
`GET /broken 404` for a request to `/de/broken`.
