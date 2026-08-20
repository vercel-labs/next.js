# Repro harness for vercel/next.js#48879 (App Router style flicker)

Minimal App Router app (Tailwind v4 + `next/font/google` Inter) plus a Playwright
probe that samples, on every animation frame, the computed `background-color` of
`<body>` and of the page element, the resolved font family and the number of
`<link rel=stylesheet>` / `<style>` nodes.

Setup:

```
npm install
npx playwright install chromium
npm run dev          # Turbopack   (use `npm run dev:webpack` for webpack)
```

Then, in a second shell, run one probe at a time:

```
npm run probe:hmr        # edits app/page.js text, watches styles across HMR
npm run probe:refresh    # clicks router.refresh() 5x
npm run probe:nav        # client navigations between /a and /b (route-level CSS)
npm run probe:slow-css   # router.refresh() with every *.css response delayed 1.5s
npm run probe:css-edit   # edits app/globals.css and app/layout.js
```

Each probe prints how many sampled frames were in each style state. A flicker /
flash-of-unstyled-content would show up as frames where `body=rgba(0, 0, 0, 0)`
or `el=rgba(0, 0, 0, 0)`.
