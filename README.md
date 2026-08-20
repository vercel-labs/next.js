# Repro: next.js#65533 — default.tsx parallel routes use parent loading.tsx

Slots `@header`/`@sidebar` each have `page.tsx`, `default.tsx` and `loading.tsx`.
`/comments` only exists in the `@comments` slot, so the other slots fall back to `default.tsx`.

## Run
```
npm install
npm run dev
```
- Open `/` → header/sidebar correctly show "Loading header..." / "Loading sidebar...".
- Hard-load `/comments` → header/sidebar incorrectly show "Loading Children..." (root `app/loading.tsx`).

Reproduced with next@16.3.1-canary.25 + react 19 (dev and production start).
