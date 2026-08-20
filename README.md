# Repro: next/image false "width or height modified" warning (vercel/next.js#61908)

Both `width` and `height` are passed as numbers, but a *fractional* height (typical when
computing height from CMS intrinsic dimensions) triggers the dev warning:

> Image with src "/img.png" has either width or height modified, but not the other. ...

Cause: `image-component.tsx` compares `img.height.toString() !== img.getAttribute('height')`.
`HTMLImageElement.height` is an integer (201) while the attribute keeps the fractional value
("200.66666666666666"), so `heightModified` is true while `widthModified` is false.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 with devtools console
```

The first `<Image>` (integer height 200) does not warn; the second (height 200.66666666666666) warns.
Verified with next 16.3.1 (also present in 14.1.0 per the issue report).
