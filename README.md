# Repro: next/link keeps focus on the clicked anchor after client-side navigation (#33060)

Next.js 16.3.1 (App Router).

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # in one terminal
BASE=http://localhost:3000 node check.mjs   # in another
```

## Expected
After a client-side navigation, focus is reset (e.g. to `body` / the new page root),
so the clicked link no longer shows `:focus` / `:focus-visible` styles.

## Actual
`document.activeElement` is still `<a id="about-link" href="/about">` and it matches
`:focus`, so link focus styles stay stuck on the previous nav item.
