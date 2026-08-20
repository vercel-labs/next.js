# Repro: metadata `other` always emits `name=`, never `property=` (vercel/next.js#64252)

## Run

```bash
npm install
npm run dev
curl -s http://localhost:3000 | grep fb:app_id
```

## Actual

```html
<meta name="fb:app_id" content="FB_APP_ID"/>
```

## Expected

Some way to emit `<meta property="fb:app_id" content="FB_APP_ID"/>`
(needed by Facebook `fb:app_id`, Farcaster frames, etc.).

Also reproduces with `npm run build && npm run start`.
Verified on next@14.2.0-canary.63 (reporter's lockfile) and next@16.3.1-canary.25.
