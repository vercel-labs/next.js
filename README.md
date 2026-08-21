# Repro harness for vercel/next.js#76138 — "Middleware causing data loss with preview apis"

Pages Router preview mode (`res.setPreviewData` / `res.clearPreviewData` + redirect) with
`middleware.js` present and `output: 'standalone'`, matching the issue report. The page reads
`data.title` without a guard, so lost props throw immediately.

## Run

```bash
npm install
npx playwright install chromium

# development
npm run dev &
npm run verify

# production (reporter also saw it on Vercel / standalone output)
npm run build && npm start &
npm run verify
```

`MW=off npm run dev` / `MW=pass ...` toggle the middleware behavior for comparison.

## Result observed here (next@canary and next@15.1.6, dev + `next start` + standalone)

```
initial          : Post | preview: false | data.title: PUBLISHED hello | ...
in preview mode  : Post | preview: true  | data.title: DRAFT hello     | ...
after end preview: Post | preview: false | data.title: PUBLISHED hello | ...
ERRORS: none
```

Props are never lost, i.e. the reported failure does **not** reproduce with the documented
preview-mode flow plus middleware. The reporter's own CodeSandbox also does not reproduce it.
Reproducing this needs the reporter's actual `middleware.ts` (matchers, auth/CMS fetch,
`NextResponse` mutations) and their `_app`/CMS data-fetch code.
