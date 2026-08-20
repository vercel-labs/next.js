# Reproduction harness for vercel/next.js#48677

Mirror of https://github.com/somersby10ml/next-url-test/tree/reproduction-template-app-dir
(the invalid `experimental.appDir` key was dropped) plus a headless Playwright harness that
automates the reporter's steps and prints every console error and `?_rsc=` request header.

## Run

```bash
npm install                 # or: npm install next@13.3.1-canary.17 react@18.2.0 react-dom@18.2.0
mkdir -p artifacts
npm run dev &               # http://localhost:3000
npx playwright install chromium
npm run verify
```

## Result

* `next@13.3.1-canary.17` (version from the issue): both scenarios log
  `Failed to fetch RSC payload. Falling back to browser navigation. TypeError: Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point.`
* `next@16.3.1-canary.25`: no console error. The prefetch request now sends a percent-encoded
  `next-router-state-tree` header, so the non-ISO-8859-1 characters never reach `new Headers()`.
