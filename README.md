# Verification harness for vercel/next.js#69467

Issue claim: with Firefox `dom.enable_performance_observer = false`, https://nextjs.org/ throws
"Application error: a client-side exception has occurred" / "PerformanceObserver is not defined".

`ff.mjs` launches real Playwright Firefox with `dom.enable_performance_observer: false`
(`typeof PerformanceObserver === "undefined"`) and reports page errors / console errors / body text
for each URL given on the command line.

## Run

```bash
npm install
npx playwright install firefox --with-deps
npm run build && npm start &   # local Next.js app (app router)
node ff.mjs http://localhost:3000/ https://nextjs.org/ https://nextjs.org/docs
```

## Result (Next.js 16.3.1, Firefox pref disabled)

Both the local app (dev + production) and nextjs.org render normally, `errors: none`.
Not reproducible today; the only `PerformanceObserver` uses in the Next.js client runtime are guarded
(`shared/lib/get-img-props.ts`, `client/legacy/image.tsx` check `window.PerformanceObserver`, and the
bundled `web-vitals` wraps `new PerformanceObserver` in try/catch).
