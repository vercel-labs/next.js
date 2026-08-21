# Repro for vercel/next.js#82522

Pages Router: clicking the `PDP` `<Link>` fires `router.replace('/plp?t=<ts>', undefined, { shallow: true, scroll: false })`
in `onClick` while the Link itself pushes `/pdp`.

Steps (must be run on iOS 17+ with Chrome 127+ / Firefox, i.e. WKWebView):
1. `npm install && npm run dev` (or open the deployed URL).
2. Home -> click `PLP` -> click `PDP`.
3. Press browser Back.

Expected: back returns to `/plp?t=<ts>`.
Reported bug (iOS Chrome only): back lands on `/` — the `/plp` entry is dropped.

The on-page log shows `history.length` and `navigation.entries().length` after each render/popstate,
so the history stack can be inspected directly on the device.

Deployed instance: https://nma-deploy-reproduction-87545b97ce40-issue-82522-83ulzzhzx.playground-vercel.tools

Verified NOT reproducible in headless Chromium 1.62 and WebKit (desktop + iPhone 14 emulation) with
Next.js 15.4.6 and 16.3.1: back always returns to `/plp?t=...` and `history.length` stays 4.
