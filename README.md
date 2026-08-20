# Repro: next/font/local preloads .woff alongside .woff2 (vercel/next.js#51356)

`app/layout.js` declares one `localFont` with two sources (woff2 + woff, same weight/style).
Next.js emits a `<link rel="preload">` for **both** files, so browsers that support woff2
still download the woff file (wasted request).

## Run

```bash
npm install
npm run build && npm run start
curl -s localhost:3000 | grep -o '<link rel="preload"[^>]*>'
```

Observed (next@16.3.1-canary.25):

```
<link rel="preload" href="/_next/static/media/inter_latin_400_normal-s.p.<hash>.woff" as="font" crossorigin="" type="font/woff"/>
<link rel="preload" href="/_next/static/media/inter_latin_400_normal-s.p.<hash>.woff2" as="font" crossorigin="" type="font/woff2"/>
```

Chromium fetches both fonts (verified with Playwright request logging).
Expected: only the woff2 source is preloaded.

Fonts: Inter (SIL Open Font License) from @fontsource/inter.
