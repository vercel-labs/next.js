# Repro for vercel/next.js#80319

Hash navigation to a **missing** hash target scrolls to the top of the *page* segment
(`app/hoge/page.js`), skipping the content rendered by the parent `app/layout.js`
(here a 340px tall header), instead of scrolling to the true top of the document.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm run start
```

1. Open http://localhost:3000
2. Click "Without Hash" (`/hoge`) -> document is at the very top, layout header visible.
3. Go back, click "With Hash" (`/hoge#foo`) -> `#foo` does not exist, but the page
   scrolls to `window.scrollY === 340`, i.e. the top of `<main id="hoge-page">`,
   and the layout header is scrolled out of view.

Automated check (Chromium via Playwright, dev/prod server must be running):

```bash
npx playwright install chromium
npm run verify
```

Observed with `next@15.4.0-canary.72` (dev and `next start`):

```
pre=0    no-hash   -> /hoge      scrollY=0    headerVisible=true
pre=0    with-hash -> /hoge#foo  scrollY=340  headerVisible=false   <-- bug
pre=1500 no-hash   -> /hoge      scrollY=98   headerVisible=true
pre=1500 with-hash -> /hoge#foo  scrollY=340  headerVisible=false   <-- bug
```
