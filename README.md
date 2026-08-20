# Repro: `window.history.pushState` inside `startTransition` is not wrapped in the transition

Upstream issue: https://github.com/vercel/next.js/issues/66016

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

Type `the` in the box, then press **"pushState in transition"** (control: **"router.push in transition"**).

Routes:
- `/`   – client component suspends on `useSearchParams()` (`use(promise)`), like the reporter's react-query `useSuspenseQuery` setup.
- `/rsc` – Server Component reads `searchParams`.

## Observed

`next@14.2.3` + react 18.3.1 (reporter's versions), `/`:
- `pushState` inside `startTransition`: `isPending` stays `IDLE` and the **`SUSPENSE FALLBACK` appears immediately** (old UI is thrown away).
- `router.push` inside the same `startTransition`: `isPending` = `PENDING`, no fallback, old UI kept until new data arrives.

`next@16.3.1`, `/`:
- `pushState`: no fallback flash anymore, but `isPending` still never becomes `PENDING`, so the user transition is still not tied to the URL update (and the update lands ~0.9s later).
- `/rsc`: `pushState` never re-renders the Server Component at all (data stays `""`), while `router.push` does.

To test the reporter's exact versions: `npm i next@14.2.3 react@18.3.1 react-dom@18.3.1 -D typescript@5.4.5 @types/react@18 @types/react-dom@18 @types/node@20`.
