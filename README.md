# Repro for vercel/next.js#52113 — does `app/error.tsx` catch errors thrown inside route groups?

## Routes
- `/promo` -> `app/(marketing)/promo/page.js` throws; the `(marketing)` group has **no** `error.js`.
- `/dashboard/panel` -> `app/dashboard/(admin)/panel/page.js` throws; the `(admin)` group **has** `error.js`.
- `/plain/throw` -> control case, no route group.

## Run
```
npm install
npm run build && npm start   # then open http://localhost:3000
# or: npm run dev
npm run check                # Playwright assertions (BASE=http://localhost:3000)
```

## Observed (Next 16.3.1, also verified on 13.4.7)
| route | boundary that rendered |
| --- | --- |
| `/promo` (route group, no group error.js) | root `app/error.js` |
| `/dashboard/panel` (route group with error.js) | `app/dashboard/(admin)/error.js` |
| `/plain/throw` | root `app/error.js` |

Same result for hard navigation and client-side navigation. Route groups do **not**
block bubbling: the root `error.js` catches errors from nested route-group segments as
long as no nearer `error.js` exists. When the group has its own `error.js`, that file is
the nearest boundary and wins — expected React error-boundary behavior, so the report is
a docs-clarification request rather than a bug.
