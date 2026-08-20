# Reproduction for vercel/next.js#53777

Scroll position is not restored when using the browser back button on iOS Safari
after a quick upward swipe (fling/momentum scroll) that re-reveals the URL bar.

## Run

```bash
npm install
npm run dev     # or: npm run build && npm start
```

Open http://localhost:3000 on an iOS Safari device (or the deployed URL).

## Steps

1. Scroll far down the list on `/`.
2. Tap a "go to detail N" link.
3. On the detail page, swipe up quickly (momentum scroll) so the Safari toolbar reappears,
   and immediately tap the back navigation.
4. Observe `scrollY` in the black probe bar at the top: it reads 0 instead of the
   previous scroll offset.

Expected: previous scroll offset is restored.

Note: reporter states this also happens on non-Next.js sites (google.com) in iOS Safari,
with both `manual` and `auto` `history.scrollRestoration`.

## Emulated-browser result (headless Playwright, this sandbox)

`emulated-check.js` (needs `playwright` installed separately) drives an iPhone-14
emulated context against the app:

```
dev-webkit:      before=4000 after=4000 scrollRestoration=auto => RESTORED
dev-chromium:    before=4000 after=4000 scrollRestoration=auto => RESTORED
prod-webkit:     before=4000 after=4000 scrollRestoration=auto => RESTORED
prod-chromium:   before=4000 after=4000 scrollRestoration=auto => RESTORED
```

Headless WebKit restores the scroll offset, so the failure needs a real iOS Safari
device where a momentum "fling" re-reveals the toolbar during the back navigation.
