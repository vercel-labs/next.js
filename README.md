# Repro for vercel/next.js#76272

A client component in the root layout (outside any Suspense boundary) is not
interactive until the streaming response of the page finishes (8s), in WebKit /
Safari only. Chromium hydrates and is interactive in ~100-300ms.

Only reproducible when served from a real remote host (e.g. a Vercel
deployment); not reproducible against `localhost`.

## Steps

1. `npm install && npm run build && npm run start` and deploy the app (Vercel).
2. Open the deployment in Safari / WebKit with an empty cache.
3. Click "Open popover" while "Loading data in 8 seconds..." is still shown.

Expected: the button toggles immediately.
Actual (WebKit): nothing happens; the page (and even the initial paint) is
blocked until the stream completes after ~8s.

`test/webkit-vs-chromium.mjs` automates it with Playwright:

```
node test/webkit-vs-chromium.mjs <deployment-url>
```

## Measured (Playwright, fresh context, deployed on Vercel)

Polling `document.documentElement.outerHTML.length` during the 8s stream:

```
webkit    127ms -> 440 chars ... 7672ms -> 440 chars ... 8179ms -> 6194 chars (complete)
chromium  593ms -> 5327 chars (shell parsed, button interactive)
```

WebKit does not process the already-received streamed bytes (~8.7 KB arrive at
~100ms, verified with a raw node client) until the response ends, so nothing is
painted or hydrated. `/plain`, a raw `ReadableStream` HTML route with an inline
onclick and no React at all, behaves identically -> this is not React hydration
or selective-hydration related.

Not reproducible against `localhost` (WebKit parses immediately there).
