# Repro: parallel route slot 404s on hard navigation / refresh (issue #73939)

Structure (only the `@card` slot has a route for `/login`):

```
app/
├── layout.tsx        # renders {children} and {card}
├── page.tsx          # links to /login
└── @card/
    ├── default.tsx
    ├── login/page.tsx
    └── signup/page.tsx
```

## Run

```bash
npm install
npm run dev
# soft nav: open http://localhost:3000 and click "to /login" -> works
# hard nav:  curl -i http://localhost:3000/login -> HTTP 404
```

## Observed (Next.js 16.3.1, also reported on 14/15)

- Soft navigation to `/login` works (card slot renders the login page).
- Hard navigation / refresh of `/login` returns **HTTP 404** and renders the
  built-in not-found in the `children` slot, even though `app/@card/default.tsx`
  exists.

## Workaround / docs gap

Adding `app/default.tsx` (a default for the *children* slot, not only the named
slot) makes `/login` and `/signup` return 200. A root catch-all
`app/[...rest]/page.tsx` also works. The parallel-routes docs only show this in
an image and never state that unmatched slots on a hard navigation need a
`default.js` for **every** slot at that level, including `children`.
