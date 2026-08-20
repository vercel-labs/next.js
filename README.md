# Reproduction for vercel/next.js#56025

`next/image` warns "has either width or height modified, but not the other" even when the
rendered image keeps its aspect ratio.

The check in `packages/next/src/client/image-component.tsx` compares the rendered
`img.width`/`img.height` to the `width`/`height` **attributes**. If the declared
`width`/`height` props do not match the file's real aspect ratio, layout resolves the
rendered size from the intrinsic ratio, so only one axis differs from the attributes and the
warning fires — even though nothing is distorted.

The image file `public/23_store-dark.png` is 1884x447 (taken from the reporter's repo).
`app/globals.css` contains only the Tailwind Preflight rules relevant to images
(`img { max-width: 100%; height: auto }`) plus the utility classes used in the issue, so
Tailwind is not needed.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 and look at the browser console
# or, headless:
node check.mjs   # requires a local chromium; prints rendered sizes + console messages
```

## Cases on the page

| case | width/height props | rendered size (1280px viewport) | warning |
| --- | --- | --- | --- |
| A (issue snippet, `max-h-[32px] w-auto h-auto`) | 300 x 32 | 135 x 32 (aspect ratio preserved) | **yes** |
| B (real intrinsic size, same classes) | 1884 x 447 | 135 x 32 | no |
| C (container narrower than props) | 300 x 71 | 200 x 47 | no |

Observed with `next@16.3.1-canary.25`: only case A warns, although its rendered
135x32 matches the file's 1884x447 ratio (4.22 vs 4.21).
