# Repro: issue #59180 — `not-found` broken with multiple root layouts

App structure (no root `app/layout.tsx` / no root `app/not-found.tsx`):

```
app/
├── (main)/ layout.tsx, page.tsx, not-found.tsx
└── (sub)/  layout.tsx, not-found.tsx, sub/page.tsx, sub/throw/page.tsx (calls notFound())
```

## Run

```bash
npm install
npm run dev        # http://localhost:3000
# or: npm run build && npm start   # http://localhost:3001
```

Then visit `/nope` and `/sub/missing`.

## Expected

The nearest/top-most group `not-found.tsx` renders for unmatched URLs.

## Actual (next@16.3.1-canary.25, dev and prod)

| URL | status | rendered |
| --- | --- | --- |
| `/` | 200 | MAIN LAYOUT main page |
| `/sub` | 200 | SUB LAYOUT sub page |
| `/sub/throw` (explicit `notFound()`) | 404 | SUB LAYOUT + SUB CUSTOM NOT FOUND |
| `/nope` | 404 | built-in "404 This page could not be found." |
| `/sub/missing` | 404 | built-in "404 This page could not be found." |

Explicit `notFound()` correctly resolves the route-group `not-found.tsx`, but unmatched
URLs always fall back to the built-in 404 because they are bound to `app/not-found.tsx`,
which cannot exist when there is no root layout / multiple root layouts.
