# Repro: vercel/next.js#85614

`next/font/local` font file is required by the bundler even when the module is only
reached through a dynamic `import()` inside a branch that is never taken.

`src/styles/fonts.ts` calls `localFont({ src: "./fonts/TTNormsPro/TT_Norms_Pro_Light.woff2" })`.
That woff2 file intentionally does not exist (proprietary font, not committed).
`src/app/layout.tsx` only imports that module when `process.env.PROPRIETARY_FONT === "TTNormsPro"`.

## Run

```bash
npm install
npm run dev   # open http://localhost:3000 -> 500
# or
npm run build
```

`PROPRIETARY_FONT` is unset, so the dynamic import branch is dead code, yet:

```
./src/styles/fonts.ts
Module not found: Can't resolve './fonts/TTNormsPro/TT_Norms_Pro_Light.woff2'
```

Reproduced with next 15.5.6 (webpack dev, webpack build, turbopack dev) and next 16.3.1-canary.26 (turbopack dev).
