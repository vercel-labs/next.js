# Repro: next#71810 — `app/icon.svg` rejected as "not a valid image file" (Next 15, webpack)

## Run

```bash
npm install
npm run build   # or: npm run dev  then open http://localhost:3000
```

## Result

```
Error: Image import "next-metadata-image-loader?type=icon&...!.../app/icon.svg?__next_metadata__"
is not a valid image file. The image may be corrupted or an unsupported format.
```

`next build` and `next dev` fail (dev returns HTTP 500 for `/`).

## Cause

`app/icon.svg` here is an Adobe Illustrator export: XML prolog + comment +
`<!DOCTYPE ... [ <!ENTITY ...> ]>` block, so the closing `>` of the root
`<svg ...>` tag sits at byte 1003. Next's `getImageSize()` (`image-size`) only
inspects the first 1000 bytes when sniffing SVG, so detection fails with
`unsupported file type: undefined`, which the metadata image loader converts to
`InvalidImageFormatError`.

Truncating the DOCTYPE so the root tag closes before byte 1000 makes the same
file build fine.

## Versions

* fails: next 15.0.2, 15.5.4, and 16.3.1-canary.25 with `next build --webpack`
* passes: next 14.2.15; next 16 canary default (Turbopack)
