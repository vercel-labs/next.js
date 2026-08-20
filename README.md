# Repro: `next/script` `strategy="afterInteractive"` still loads during initial page load (issue #43561)

The reporter's CodeSandbox (`nextjs-script-defer-issue-mh6lnq`) is no longer reachable, so this is a
minimal rebuild on `next@canary` covering both routers plus the exact gtag snippet from the docs.

## Routes
- `/` – App Router layout with `<Script src="/slow-third-party.js" strategy="afterInteractive" />`
  plus an inline `gtag-init` script. `/slow-third-party.js` marks its execution time and burns 300 ms
  of main thread, standing in for `gtag.js`.
- `/gtag` – App Router page using the real `https://www.googletagmanager.com/gtag/js?id=...` snippet
  from the Next.js docs, for Lighthouse runs.
- `/control` – identical page with no `next/script`, Lighthouse baseline.
- `/pages-router` – same scripts through the Pages Router, for comparison.

## Run
```bash
npm install
npm run build
npm start                 # http://localhost:3000
npm run measure           # Playwright timings (set BASE=http://localhost:3000)
CHROME_PATH=$(node -e "console.log(require('playwright').chromium.executablePath())") \
  npx lighthouse@12 http://localhost:3000/gtag --only-categories=performance --quiet
```

## Observed on next@16.3.1-canary.25 (production build)
* Initial HTML of App Router routes contains
  `<link rel="preload" href="https://www.googletagmanager.com/gtag/js?id=..." as="script"/>` in
  `<head>` with **no** `fetchPriority="low"` (Next's own chunk preload does use `fetchPriority="low"`),
  so the third-party fetch starts before first paint: request start 35 ms vs FCP 60 ms.
* `npm run measure`: App Router `thirdPartyRequestStart` 35 ms, FCP 60 ms, hydration mark 129 ms,
  third-party execution 132 → 432 ms. Pages Router injects after hydration (request start 104 ms).
* Lighthouse (`/gtag` vs `/control`): third-party summary lists Google Tag Manager, 149 kB,
  69 ms main-thread blocking; TBT 1320 ms vs 1240 ms on the script-free control page.
