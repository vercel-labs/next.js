# Reproduction for vercel/next.js#69852

Wrong `error.tsx` is matched for a parallel route slot that falls back to `default.js`.

## App structure

```
app/
  layout.js            renders {children} in #children and {slot} in #slot
  error.js             renders "Home error"
  page.js              throws
  page/[id]/page.js    throws            (dynamic route)
  static/one/page.js   throws            (static route)
  @slot/
    error.js           renders "Slot error"
    page.js            throws
    default.js         throws            (used when @slot has no match)
```

## Steps

```bash
npm install
npm run dev            # or: npm run build && npm start
```

1. Open `/` -> `#children` shows **Home error**, `#slot` shows **Slot error** (correct).
2. Client-side navigate to `/page/one` -> still correct.
3. Reload (hard load) `/page/one` -> `#slot` shows **Home error**: the error thrown inside
   `app/@slot/default.js` is caught by `app/error.js` instead of `app/@slot/error.js`.
   Same for `/static/one`, so a dynamic segment is not required.

Optional automated check (needs `npm i -D playwright && npx playwright install chromium`):

```bash
node verify.js http://localhost:3000
```

## Result

* Reproduced on `next@14.2.8` (`next dev` and `next start`) and on `next@16.3.1-canary.25` (`next dev`).
* Only hard loads / server-rendered requests are affected; client-side navigation matches the
  correct boundary. Related: vercel/next.js#65533 (same problem with `loading.tsx`).
