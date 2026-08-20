# next.js#73017 — URL search params get encoded on page load

Mirror of the reporter's repro (https://github.com/wkd-kapsule/next-router-demo, commit 34745da)
with Next bumped to 16.3.1 (15.0.3 is blocked from Vercel deploys as a vulnerable version).

## Run

```bash
npm install
npm run build && npm start
# then, in another shell:
node check-url-encoding.mjs http://localhost:3000
```

`check-url-encoding.mjs` (Playwright) loads `/?page=/test`, `/?page=$foo`, `/?page=/a/b/c`,
waits 2.5s after load, and prints the URL before/after hydration, plus a back-navigation check.

## Result

No encoding observed. `/?page=/test` stays `/?page=/test` after hydration and after
`router.push()` navigations, on `next start` locally (Next 15.0.3 and 16.3.1) and on a
Vercel deployment (Next 16.3.1). Only a literal space is normalized to `%20` by the browser.
The reporter's demo deployment (next-router-demo-eight.vercel.app) now returns 404.
