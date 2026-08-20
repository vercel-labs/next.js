# Repro: issue #56253 — `output: 'export'` + `generateStaticParams()` + `dynamic`/`dynamicParams`

```
npm install
npm run dev
# then: curl -i localhost:3000/ localhost:3000/foo localhost:3000/nope
```

Routes:
- `app/[[...slug]]/page.js` — `dynamic = 'force-static'`, `dynamicParams = false`, GSP returns `[]`, `foo`, `bar`
- `app/p/[id]/page.js` — `dynamicParams = false`, GSP returns `1`, `2`

Observed (Next 16.3.1-canary.25, Turbopack):
- `/`, `/foo`, `/p/1` -> 200 (rendered)
- `/nope`, `/p/9` -> 404
- terminal still logs a misleading error for non-generated paths:
  `⨯ Failed to generate static paths for /[[...slug]]: Page "/[[...slug]]/page" is missing param "/[[...slug]]" in "generateStaticParams()", which is required with "output: export" config.`

Version matrix with the same app:
- 13.5.4 / 14.2.33 -> HTTP 500 on **every** route, `Page "/[[...slug]]/page" is missing exported function "generateStaticParams()"` (the originally reported bug)
- 15.5.7 / 16 canary -> generated routes 200, non-generated 404 (fixed); only the log message above remains
