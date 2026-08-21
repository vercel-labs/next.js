# Repro: next/image with `unoptimized` + `basePath` does not prefix `public/` images (issue #81259)

Next.js 16.3.1 (also 15.3.4). `output: 'export'`, `basePath: '/unnuo'`, `assetPrefix: '/unnuo'`,
`images.unoptimized: true`.

## Run

```bash
npm install
npx next build
grep -o '<img[^>]*>' out/index.html
```

## Observed

Both `next/image` and a plain `<img>` emit `src="/next.svg"` — no `basePath`:

```html
<img id="next-image" ... src="/next.svg"/>
<img id="plain-img" src="/next.svg" .../>
```

Served under the base path (as GitHub Pages does), `/next.svg` is 404 while the file is at
`/unnuo/next.svg`. Expected (per reporter): `next/image` should resolve `basePath` for public assets.
Documented behaviour is that `assetPrefix`/`basePath` do not apply to `public/`, so this is a
docs/DX request, but with `unoptimized: true` `next/image` also skips the prefix that the
default loader would otherwise add (`/unnuo/_next/image?url=%2Fnext.svg`).
