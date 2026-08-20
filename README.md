# Repro: next.js#68933 — "You cannot use both an required and optional catch-all route"

Optional catch-all in the `children` slot (`app/[[...params]]/page.tsx`) + the documented
modal-dismissal catch-all in a parallel slot (`app/@modal/[...catchall]/page.tsx`).

## Run

```bash
npm install
npm run dev   # visit http://localhost:3000/  -> 500
```

Observed on Next.js 16.3.1 (and reported on 14.2.5):

- `next dev`: `⚠ Failed to reload dynamic routes: Error: You cannot use both an required and optional catch-all route at the same level ("[...catchall]" and "[[...params]]" ).` then unhandledRejection; every request returns 500.
- `next build`: succeeds (routes `/[...catchall]` and `/[[...params]]` both emitted).
- `next start`: `✓ Ready`, then the same error on first request -> 500.

## Secondary issue (why the catch-all was added)

Delete `app/@modal/[...catchall]` and the app works, but the intercepted modal is never
dismissed: from `/`, open the photo modal, then client-navigate to `/photos` — the URL is
`/photos`, `#all-photos` renders, and `#modal` is still mounted
(body text: `All Photos here | Photo 1 modal`).
