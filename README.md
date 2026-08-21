# next.js#91321 — notFound() poisons the "use cache" entry

Minimal, deterministic reproduction of https://github.com/vercel/next.js/issues/91321
(no Playwright / no browser needed).

```bash
npm install
npm run build
node repro.mjs
```

## What it does

`app/p/[id]/page.tsx` renders a `"use cache"` component that looks the record up in
`db.json` and calls `notFound()` when it is missing, then calls
`cacheLife("max")` / `cacheTag(`pokemon-${id}`)` — exactly the ordering used in the
issue report (`cachePokemon(pokemon.id)` after `getPokemon(id)`).

1. `GET /p/1` while the record exists -> 200 with the record (cached, tagged).
2. `GET /api/db?op=del&id=1` deletes the record and calls `revalidateTag("pokemon-1")`;
   `GET /p/1` now renders `not-found.tsx`. Expected.
3. `GET /api/db?op=add&id=1` restores the record and calls `revalidateTag("pokemon-1")`.
   `GET /p/1` **keeps rendering `not-found.tsx` for the rest of the server's life**, and the
   server log shows the cached component is never executed again.

Because `notFound()` throws before `cacheTag()` runs, the cached `notFound` outcome is
stored with no tags at all, so no `revalidateTag` / `updateTag` can ever clear it. Any
transient miss (a database reset between e2e tests, a deploy, a race) permanently 404s a
URL that should return 200 — the "cache poisoning" from the issue.

`app/q/[id]/page.tsx` is the control: identical, but `cacheTag()` runs *before* the lookup,
and that route recovers correctly after `revalidateTag`.

Reproduced with next@16.2.0-canary.95 and next@16.1.6, in `next start` and `next dev`.
