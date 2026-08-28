# Repro: `@next/third-parties` GoogleTagManager still defaults to `googletagmanager.com/gtm.js`

Issue: https://github.com/vercel/next.js/issues/98017

Google deprecated `https://www.googletagmanager.com/gtm.js` in favour of
`https://www.googletagmanager.com/gtag/js` (https://support.google.com/tagmanager/answer/17231523),
but `GoogleTagManager` in `packages/third-parties/src/google/gtm.tsx` still hardcodes
`gtmScriptUrl || 'https://www.googletagmanager.com/gtm.js'`.

## Run

```bash
npm install
npm run dev
curl -s http://localhost:3000 | grep -o 'googletagmanager[^\"]*'
```

## Expected vs actual

- expected: `www.googletagmanager.com/gtag/js?id=GTM-XYZ123` (new default)
- actual:   `www.googletagmanager.com/gtm.js?id=GTM-XYZ123`
