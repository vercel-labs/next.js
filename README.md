# Repro: next.js#82829 — getStaticProps data not fetched on browser Back when a rewrite + middleware exist (pages router)

Minimal reproduction for https://github.com/vercel/next.js/issues/82829 (Next.js 16.3.1).

Setup: `next.config.js` rewrites `/hunder -> /dogs`, `/hunder/:code -> /dogs/:code`; a pass-through
`middleware.js` matches all non-asset paths; `pages/dogs/*` use `getStaticProps`.

## Steps (must be deployed to Vercel; `next start` does not reproduce)

1. Deploy this directory to Vercel.
2. Open `/hunder` -> list renders, `#props-status` is `PROPS_OK`.
3. Click a breed link -> `/hunder/akita` renders.
4. Press browser Back.

### Actual (with `middleware.js`)
Router requests the *source* data URL `/_next/data/<buildId>/hunder.json`. Vercel applies the
rewrite to that data path, so it returns the **HTML document** for `/dogs` (`x-matched-path: /dogs`)
instead of JSON. The router ends up with no `pageProps`: the page renders
`PROPS_MISSING`, `stamp: undefined` and an empty list. No console/page error.

### Expected (delete `middleware.js` and redeploy)
Router requests `/_next/data/<buildId>/dogs.json`, gets JSON props, page renders `PROPS_OK`
with the list intact.

## Automated check

```bash
npm install && npx playwright install chromium
node verify.mjs https://<your-deployment-url>
```
Prints `props-status: PROPS_MISSING` on the buggy (middleware) deployment and `PROPS_OK` without middleware.
