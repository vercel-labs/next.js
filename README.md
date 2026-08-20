# Repro: issue #73746 — `dynamicParams = true` with `output: 'export'`

next.config.js sets `output: 'export'`. `app/assessment/results/[id]/page.js` sets
`export const dynamicParams = true` and `generateStaticParams()` returning only `{ id: '1' }`.

## Run
```
npm install
npm run dev
curl -i http://localhost:3000/assessment/results/6   # 500
curl -i http://localhost:3000/assessment/results/1   # 500 too (with explicit dynamicParams = true)
```

Observed (next@16.3.1-canary.25 and 15.5.4):
`Error: "dynamicParams: true" cannot be used with "output: export".` for BOTH the
non-prerendered param (/6) and the prerendered param (/1).
Removing the `export const dynamicParams = true` line makes /1 return 200 and /6 fail with
`Page "/assessment/results/[id]/page" is missing param ... in "generateStaticParams()"`.
