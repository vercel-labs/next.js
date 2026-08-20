# Repro: undocumented causes of "deopted into client-side rendering" (issue #49867)

Two minimal app-router apps. Routes:

- `/b` – server page that reads the `searchParams` prop, no `loading.jsx`
- `/c` – `loading.jsx` is a client component calling `useSearchParams()` (the page itself never uses it)
- `next-13/a` – documented baseline: client component using `useSearchParams()` without `<Suspense>`

## Run

```bash
cd next-13 && npm install && npx next build     # Next 13.4.4
cd next-latest && npm install && npx next build # Next 16.3.1
```

## Observed

Next 13.4.4 build:

```
warn Entire page /a deopted into client-side rendering. https://nextjs.org/docs/messages/deopted-into-client-rendering /a
warn Entire page /c deopted into client-side rendering. https://nextjs.org/docs/messages/deopted-into-client-rendering /c
```

`/b` is not warned about at all (it is just rendered dynamically), so the reporter's first claim
(`searchParams` prop without a `loading` file) does not hold.

Next 16.3.1 build fails on `/c`:

```
useSearchParams() should be wrapped in a suspense boundary at page "/c".
Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
Error occurred prerendering page "/c".
```

So `useSearchParams()` inside `loading.jsx` still opts the whole route out of prerendering
(now a hard build error), and neither
https://nextjs.org/docs/messages/deopted-into-client-rendering nor the `useSearchParams`
prerendering docs mention it.
