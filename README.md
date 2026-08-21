# Repro: `<ViewTransition>` renders a blank/white viewport when the document is RTL

Minimal reproduction for https://github.com/vercel/next.js/issues/87773
(Next.js 16.1.1, React 19.2.3, `experimental.viewTransition: true`).

`/a` (red) and `/b` (blue) are each wrapped in React's `<ViewTransition>`, and the
root cross-fade is slowed to 3s so the transition is easy to observe:

```css
::view-transition-old(root) { animation: fade-out 3s linear both; }
::view-transition-new(root) { animation: fade-in  3s linear both; }
```

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
# open http://localhost:3000/a and click "go to /b"
```

The root layout renders `dir="rtl"` by default; build/start with
`NEXT_PUBLIC_DIR=ltr` for the LTR control. The `dir = rtl` button on the page
flips `document.documentElement.dir` live, no rebuild needed.

## Result

| document direction | during the 3s transition |
| --- | --- |
| `dir="ltr"` | red page cross-fades into the blue page (0% white pixels) |
| `dir="rtl"` | viewport is **100% white** for the whole transition, then snaps to blue |

Same in `next dev` and `next build` + `next start`, with no console/page errors.
The DOM is identical in both directions (`#page-b` is present, full size,
`opacity: 1`); only the painted snapshot is blank.

A plain static HTML page (no Next.js) using `document.startViewTransition()`
with `dir="rtl"` cross-fades correctly, so this is not a plain browser RTL bug.

## Automated checks (Playwright)

```bash
npm i -D playwright && npx playwright install chromium
npm run build && PORT=3001 npx next start &                      # rtl build
NEXT_PUBLIC_DIR=ltr npm run build && PORT=3002 NEXT_PUBLIC_DIR=ltr npx next start &  # ltr build
node test/dirswap.mjs     # white-pixel percentage mid-transition, per direction
node test/vt2.mjs         # DOM + running animations mid-transition (TAG/BASE env)
node test/workaround.mjs  # CSS workarounds tried on the rtl build
```

Observed output of `test/dirswap.mjs`:

```
rtl-build as-is                   dirs= ["rtl",null,"rtl"] white% = 100
rtl-build dir removed at runtime  dirs= [null,null,"ltr"]  white% = 0
ltr-build as-is                   dirs= ["ltr",null,"ltr"] white% = 0
ltr-build dir=rtl at runtime      dirs= ["rtl",null,"rtl"] white% = 100
```

`test/workaround.mjs`: neither `::view-transition-old(root),::view-transition-new(root)
{ direction: inherit }` nor `::view-transition { direction: ltr }` nor moving
`dir="rtl"` from `<html>` to `<body>` avoids the blank frame (all 100% white).
