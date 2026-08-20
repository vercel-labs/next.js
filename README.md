# Repro: vercel/next.js#56262

Client component using `useSearchParams()` still renders on the server, so
top-level/render-time `window` access throws `ReferenceError: window is not defined`.

## Run

```bash
npm install
npm run dev
# then: curl http://localhost:3000/
```

Dev server log shows:

```
>>> GlobalProvider: SERVER
⨯ ReferenceError: window is not defined
    at GlobalProvider (app/GlobalProvider.tsx:19:17)
```

`GlobalProvider` is a `'use client'` component wrapped in `<Suspense>` in `app/layout.tsx`
and calls `useSearchParams()`, which per the reporter's expectation should keep it
client-only. It is still executed during SSR.
