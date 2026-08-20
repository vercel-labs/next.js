# Reproduction: issue #75334 — root layout static metadata/viewport remounted on client navigation

Reported symptom: navigating with `<Link>` to a dynamic page (`await connection()`) that has a
`loading.tsx` makes the *static* RootLayout metadata (`title`, `viewport.themeColor`) flicker /
reload, breaking client-side meta mutations (e.g. `next-themes` PWA `theme-color`).

## Run

```bash
npm install
npm run build
npm start           # http://localhost:3000
node check3.mjs     # navigation probe: client-applied theme-color is reverted
node check2.mjs     # raw <head> MutationObserver log: REMOVE + ADD of title/viewport/theme-color
```

`app/meta-theme.tsx` mimics `next-themes`: after hydration it sets
`meta[name="theme-color"]` to `#ff0000`. The root layout's static value is `#e0e7ff`.

## Observed (next@16.3.1-canary.25 and next@15.1.6, `next build && next start`)

```
after hydration+client effect: #ff0000
+0ms   theme-color=#ff0000 title=STATIC ROOT TITLE
+76ms  theme-color=#e0e7ff title=STATIC ROOT TITLE   <-- root layout metadata remounted
```

`check2.mjs` shows `<meta charset>`, `<meta name="viewport">`, `<meta name="theme-color">` and
`<title>` all removed and re-inserted on the navigation, even though they come from the
unchanged static root layout (15.1.6 does this twice per navigation).

Notes from measurements:
- With `loading.tsx`: remount happens immediately at navigation start (~80ms).
- Without `loading.tsx`: same remount, deferred to when the dynamic page resolves (~3s).
- Static -> static navigation also remounts the root layout metadata, so the churn is not
  specific to `loading.tsx`/dynamic pages.
- Happens in `next dev` too, just later in the navigation.
