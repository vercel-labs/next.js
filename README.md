# Reproduction: vercel/next.js#73988

Fragment surrounding a metadata tag (`<title>`) breaks App Router scroll-to-top on navigation.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # http://localhost:3001
npm run test:scroll    # automated check (dev server must be running)
```

Manual: scroll to the bottom of `/`, click `Bar` (title inside `<div>`) -> scrolls to top.
Scroll to the bottom of `/` again, click `Foo` (title inside `<>`) -> scroll position stays at the bottom.

## Observed

`next@16.2.0` (also 15.1.1-canary.6, 15.2.4, 15.5.4, 16.0.0):

```
Bar: before=1506 after=0
Foo: before=1506 after=1506   <-- bug
```

`next@16.3.0` and `16.3.1-canary.25` output `after=0` for both, i.e. the issue appears fixed
by the Fragment-ref based scroll handling in the layout router.
Change the `next` version in package.json to compare.
