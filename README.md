# Repro: next/image false positive width/height warning (vercel/next.js#47278)

`getImgProps` allows non-integer `width`/`height`, but `image-component.tsx` compares
`img.width` (rounded by the DOM) against the raw `width` attribute string, so a fractional
dimension always looks "modified".

```
npm install
npm run dev   # open http://localhost:3000 and look at the browser console
```

Expected: no warning. Actual: image #2 (`width={10.5} height={10}`) logs
`Image with src ".../test-b...svg" has either width or height modified, but not the other. ...`
