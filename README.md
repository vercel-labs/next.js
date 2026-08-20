# Repro attempt for vercel/next.js#47112

"Client side navigation not working when middleware is enable for SSG" — 404 on
`/_next/data/...` prefetch / empty `pageProps` after client-side navigation when a
middleware file exists (pages router + i18n, reported on Vercel only).

The issue's original repro link (`AdilAmanat/documentation-starter-kit`) no longer
exists, so this is a minimal rebuild of the described setup:

- `pages` router, `basePath: '/docs'`, i18n with `defaultLocale: 'default'`
- `middleware.js` redirecting the `default` locale to `/en`, `NextResponse.next()` otherwise
- `/ssg` (`getStaticProps`), `/blog/[slug]` (`getStaticPaths` + `fallback: 'blocking'`),
  `/ssr` (`getServerSideProps`), `/` automatically static
- `next/link` prefetch + click for every target

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start &        # production server on :3000
npm run verify                      # or: node verify.mjs https://<deployment-url>
```

## Result on next@canary (16.3.1-canary.25)

Client-side navigation and prefetch **work**: every `/_next/data/<buildId>/en/*.json`
prefetch returns `200 application/json` with the right props, and each click lands on
the target page with correct props. Same result on a Vercel deployment of this app and
with `next@13.2.4` locally.

One middleware-specific anomaly remains (the root cause the reporter pointed at):
a `GET /docs/_next/data/<buildId>/en.json` for the automatically-static `/` page returns
`200` with a **full HTML document** (`content-type: text/html`) when `middleware.js`
exists, while the identical app without middleware returns `404` for that URL.
On canary the router tolerates this, so no user-visible 404 occurs.
