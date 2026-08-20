# next/image flashes the page background on refresh — repro for vercel/next.js#71077

Minimal reproduction of "Image Component flicker when refresh the page".

A full-viewport `next/image` (`fill` + `placeholder="blur"` + static import) on a page whose
`<body>` background is bright **red**, so any painted frame without the image (or its blur
placeholder) is unmistakable.

## Run

```bash
npm install

# development (Turbopack, next dev)
npm run dev            # http://localhost:3200
node compare-cache.js http://localhost:3200/ dev

# production control
npm run build && npm start   # http://localhost:3201
node compare-cache.js http://localhost:3201/ prod
```

`compare-cache.js` opens the page, waits for the browser cache to warm, then performs
(1) a normal reload and (2) a cache-bypassing hard reload, recording every painted frame via
CDP `Page.startScreencast` and reporting the fraction of red pixels per frame.
Frames are written to `frames-<label>-<reload|hardreload>/`.

`measure-flash.js http://localhost:3200/ dev` does a single warm-cache reload and additionally
prints paint timings (`LATENCY_MS=150` emulates RTT to widen the window).

## Observed (Next.js 16.3.1-canary.25, React 19.2.0, Chromium 151 headless)

```
dev  normal reload (warm cache)   frames: 0ms red=0 | 88ms red=1.00 | 113ms red=0 ...  fullRedFrames=1
dev  hard reload (cache bypass)   frames: 0ms red=0 | 488ms red=0 | 505ms red=0        fullRedFrames=0
prod normal reload (warm cache)   frames: 0ms red=0 | 41ms red=1.00 | 62ms red=0 ...   fullRedFrames=1
prod hard reload (cache bypass)   frames: 0ms red=0 | 290ms red=0 | 301ms red=0        fullRedFrames=0
```

* On a **normal refresh with a warm cache**, first contentful paint is a 100% red frame — the
  image and its blur placeholder are not painted yet — followed ~20-25 ms later by the image.
  That gap is the reported flicker.
* On a **hard refresh** the first painted frame already contains the image: no red frame at all.
* On Next.js 14.2.35 (`next dev`) the gap is much larger, because in development the blur
  placeholder is not inlined: the `img` gets
  `background-image: url("/_next/image?url=...&w=8&q=70")`, an extra HTTP request, while
  `next build` inlines `background-image: url("data:image/svg+xml,...")`.
  With 150 ms emulated RTT, `next dev` painted a pure white screen for ~1.6 s after refresh,
  whereas `next start` was blank for only ~32 ms.
