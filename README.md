# Reproduction for vercel/next.js#58796

> Docs show multiple `default.js` files used for parallel routes, but never explain why

Next.js **16.3.1** (Turbopack), React 19.2.0, Node 24.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
./verify.sh            # curl probes for every route (server must be running)
node check.mjs         # Playwright: modal open/dismiss via <Link>
```

## App shape

```
app/
  layout.tsx                     # renders {children} + {modal}
  default.tsx                    # <-- the "unexplained" root default (prints #root-default)
  page.tsx  about/page.tsx  photo/[id]/page.tsx
  @modal/
    default.tsx                  # returns null
    (.)photo/[id]/page.tsx       # intercepted modal (#modal)
    [...catchAll]/page.tsx       # docs "dismiss modal" pattern
    reviews/page.tsx             # route that exists ONLY in the slot (#reviews-slot)
```

## Observed (16.3.1)

| Route / action | `app/default.tsx` rendered? |
| --- | --- |
| `/`, `/about` | no |
| `/photo/1` (hard load, full page) | no |
| `/photo/1` (soft nav, modal shown) | no |
| `/reviews` (route exists only in `@modal`) | **yes** |

* Deleting `app/default.tsx`: dev + `next build` still succeed, all routes above keep working,
  **except** `/reviews` which now returns **404**.
* Nextgram-style shape (no route that exists only in a slot) therefore does not need the root
  `default.js` at all — the reporter's "Failed to read source code from .../app/default.tsx"
  error is a stale `.next` cache artifact and does not reproduce on a clean cache.
* The comment claim "modal does not unmount when navigating via `Link href`" does **not**
  reproduce: `check.mjs` shows `modal=1` on `/photo/1`, `modal=0` after clicking `Link href="/about"`.

Conclusion: the root `default.js` in the docs graphic only matters when a sibling slot matches a
route segment that `children` does not match; that is what the docs never state.
