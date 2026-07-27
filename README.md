# Next.js App Router × Chrome LowPriorityAsyncScriptExecution reproduction

This reproduction runs on Next.js `16.3.0-canary.97` and serves its App Router page from
`127.0.0.1:3000` while serving `_next/static` from `localhost:4000`. Those hosts are
cross-site, so a supported desktop Chrome applies `LowPriorityAsyncScriptExecution` to the
async chunk scripts without requiring a feature-forcing flag.

## Run

```bash
npm install
npm run build
npm run start
```

`npm run start` starts both the Next.js server and the local cross-site static server.

## Reproduce

1. Launch Chrome with a fresh profile:

   ```bash
   # macOS
   open -na "Google Chrome" --args \
     --user-data-dir=/tmp/chrome-repro
   ```

2. Open DevTools → Performance and set CPU throttling to **6× slowdown**.
3. Cold-navigate from `about:blank` to `http://127.0.0.1:3000/`.
4. Record a trace and inspect when the `localhost:4000/_next/static/chunks/*` responses
   finish versus when their `EvaluateScript` tasks run. The server-rendered HTML contains
   cross-site `<script async>` tags without `fetchpriority`.
5. Measure DCL→load in the console:

   ```js
   const nav = performance.getEntriesByType('navigation')[0];
   nav.loadEventStart - nav.domContentLoadedEventEnd;
   ```

## Control

Repeat with a different fresh profile and the intervention disabled:

```bash
open -na "Google Chrome" --args \
  --user-data-dir=/tmp/chrome-control \
  --disable-features=LowPriorityAsyncScriptExecution
```

On Chrome for Testing 149 with 6× CPU slowdown, 12 headed cold runs on canary had a
DCL→load median of 211.9 ms with the default intervention and 204.1 ms with it disabled.
All 12 default runs exceeded 194 ms; 3 of 12 disabled runs completed within 22 ms. Traces
showed only 7–9 `RunMicrotasks` events, so this small canary reproduction did not produce
the reported high-volume hydration retry storm.
