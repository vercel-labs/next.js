# Repro: next/image `onError` re-assigns `src` (issue #60061)

`packages/next/src/client/image-component.tsx` does `img.src = img.src` in a layout
effect when `onError` is provided. This is not pure: it restarts the image request.

## Run

```bash
npm install
npx next dev            # http://localhost:3000
node check.js http://localhost:3000/
```

`check.js` (Playwright, chromium) loads `/`, lets the page re-render once per second for
6s, and reports:

* `imageRequests` – network requests per image
* `onLoadCalls` – how often the React `onLoad` prop fired
* `nativeImgLoadEvents` – native `load` events observed after hydration

`/` renders two identical optimized images: the left one has `onError={() => {}}`,
the right one does not. `/slow` renders the same pair behind a 1.5s image route.

## Results

Next 16.3.1-canary.25 (dev and `next build && next start`):

```
onLoadCalls:   { with: 0, without: 1 }
imageRequests: { withOnError: 2, withoutOnError: 1 }
```

Next 14.1.0 (dev): `nativeImgLoadEvents: { with: 14, without: 0 }` – the image with
`onError` reloads on every re-render (original report: GIFs restart, flashing).
