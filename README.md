# Reproduction attempt: vercel/next.js#55691

"Link prefetch requests are throwing 404 errors, but only in production." (Pages Router)

The reporter's own CodeSandbox link states it does not reproduce, and their demo host
(`jefferson-pre-production-...z01.azurefd.net/medicare/en/`) now returns 404 for every path.
This harness recreates the reported URL shape locally with a real production server:
`basePath: '/medicare'` + `i18n` + `trailingSlash: true`, three `getStaticProps` pages and
`next/link` prefetching.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # production server, port 3000
npm run probe          # prints status of every /_next/data prefetch request
```

## Result

All prefetch requests succeed on `next@canary` and on `next@13.4.19` (the version the
reporter says regressed vs 13.4.8):

```
200 GET http://localhost:3000/medicare/_next/data/<BUILD_ID>/en/about.json
200 GET http://localhost:3000/medicare/_next/data/<BUILD_ID>/en/blog/one.json?slug=one
```

## What does produce a 404 locally

Direct requests against the same server (useful when triaging a CDN in front of Next):

| request | status |
| --- | --- |
| `/medicare/_next/data/<BUILD_ID>/en/about.json` | 200 |
| `/medicare/_next/data/<BUILD_ID>/en/about.json` without the locale segment | 404 |
| `/medicare/_next/data/<STALE_BUILD_ID>/en/about.json` | 404 |

A stale `BUILD_ID` embedded in HTML cached by a CDN (Azure Front Door in the report) while the
origin serves a newer build is enough to make every prefetch 404 for pages that exist.
