# Repro: `@next/third-parties` global `Window` index signature collapses mapped types (vercel/next.js#85555)

`@next/third-parties/google` ships `declare global { interface Window { dataLayer?: Object[]; [key: string]: any } }`
(`node_modules/@next/third-parties/dist/types/google.d.ts`). The string index signature makes
`Omit<Window, ...>` — used by `@types/jsdom`'s `DOMWindow` — collapse to `{ [k: string]: any }`.

## Run

    npm install
    npm run types    # tsc --noEmit  -> fails
    npm run build    # next build    -> "Failed to type check"

## Expected vs actual

`app/page.tsx` asserts `typeof dom.window.document extends Document`. It fails:

    app/page.tsx(14,7): error TS2322: Type 'true' is not assignable to type 'false'.

Removing the `import { GoogleTagManager } from '@next/third-parties/google'` line makes `tsc --noEmit` pass.
