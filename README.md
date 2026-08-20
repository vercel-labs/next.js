# Repro harness for vercel/next.js#52444 — "AppRouter Suspense not working in Safari"

Minimal App Router page with a `Suspense` boundary around a 5s async server component,
plus a raw HTTP streaming server used to probe WebKit's first-chunk buffering threshold,
plus a Playwright probe that records when the shell/fallback/final content first appear
in Chromium and WebKit.

## Run

```bash
npm install
npx playwright install chromium webkit

# A) Next.js canary (dynamic route, streamed Suspense fallback)
npm run build && npm start        # port 3001
npm run probe:next

# B) Raw stream with a controllable first-chunk size
npm run raw                       # port 4000, ?size=<bytes>
npm run probe:raw
```

## Observed (Next.js 16.3.1-canary.25, React 19, WebKit 17.0 and 26.5)

* Next.js flushes ~4.9 KB before the Suspense boundary resolves, so the fallback paints
  at ~130 ms in both Chromium and WebKit — the reported bug does **not** reproduce.
* The raw server shows the underlying WebKit behaviour: with a first chunk of < 1024 bytes
  WebKit paints nothing until the response ends (~5 s); at >= 1024 bytes it paints
  immediately. Chromium always paints immediately.
