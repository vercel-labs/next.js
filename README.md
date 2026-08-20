# Repro: next/image ignores `assetPrefix` (vercel/next.js#33488)

`assetPrefix` is applied to `/_next/static/*` assets but the default image loader
still emits a root-relative `/_next/image?url=...` URL, so optimized images are
requested from the app origin instead of the CDN.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
# or: npm run build && npm start
curl -s localhost:3000 | grep -o '<img[^>]*>'
```

## Observed (next 16.3.1)

```html
<img ... src="/_next/image?url=https%3A%2F%2Fcdn.example.com%2Fimages%2Fcat.jpg&w=64&q=75">
```
while scripts load from `https://cdn.example.com/_next/static/...`.

## Expected

`src="https://cdn.example.com/_next/image?url=..."`
