# Reproduction for vercel/next.js#71601

Two things the issue asks about, reduced to runnable code (Next.js 14.2.15, Node 20+):

## 1. No per-request server instrumentation hook; layout and page render in parallel

`instrumentation.js` `register()` runs **once per server process** (not per request), and
`app/layout.jsx` / `app/page.jsx` log render start/end timestamps showing both render
concurrently, so a custom library cannot wrap "one request" around them.

## 2. Rewriting the RSC payload in a proxy layer breaks the stream / hydration

`proxy.mjs` is a minimal proxy in front of `next start` that string-substitutes a marker
for a **different-length** value in `text/html` and `text/x-component` responses (what a
"decrypt at the proxy layer" step does). React Flight text rows are length-prefixed
(`T<id>,<hexByteLength>`), so changing the byte length corrupts the payload.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &      # Next.js on :3000
npm run proxy &  # rewriting proxy on :3100
npm run check    # Playwright: loads http://127.0.0.1:3100 and navigates
```

## Observed

Server log:

```
[instrumentation] register() called once, pid=1673
[page]   render start t=1787266598215
[layout] render start t=1787266598215   <- identical start: parallel render
```

Browser console during client navigation through the proxy:

```
Failed to fetch RSC payload for http://127.0.0.1:3100/other. Falling back to browser navigation. Error: Connection closed.
Minified React error #423 (hydration failed, client-side rendering fallback)
```

Without the proxy (`http://127.0.0.1:3000`) navigation and hydration succeed.
