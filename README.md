# Reproduction — vercel/next.js#68934

`revalidateTag()` on one fetch resets the whole ISR page expiration, so *other*
cached fetches on the page keep being served long after their own `revalidate`
window has elapsed.

## Setup

`/cache/[slug]` (ISR, `export const revalidate = 3000`) renders two tagged fetches:

- fetch **A**: `next: { revalidate: 60, tags: ['A'] }`
- fetch **B**: `next: { revalidate: 20, tags: ['B'] }`

## Run

```bash
npm install
npm run build
npm start          # http://localhost:3000
# in another shell: polls /cache/x every 2s and calls revalidateTag('A') after 15s
node drive.mjs 15 130
```

`drive.mjs <secondsUntilRevalidateTagA> <totalSeconds>` prints elapsed time,
`x-nextjs-cache`, and the A/B timestamps from the rendered HTML.

Or manually: open `/cache/x`, wait a few seconds, hit
`/api/revalidate?tag=A`, then keep reloading `/cache/x` and watch when the
B timestamp finally changes.

## Observed (next 14.2.5)

```
   2.1 HIT   A= 22:20:22.353Z B= 22:20:22.361Z   <- page rendered; B due at 22:20:42
  16.1 *** revalidateTag("A")
  16.2 MISS  A= 22:20:38.453Z B= 22:20:22.361Z   <- re-render: A refreshed, B from cache
  36.2 STALE A= 22:20:38.453Z B= 22:20:22.361Z   <- 22:20:42 passed, B still stale
  38.2 HIT   A= 22:20:38.453Z B= 22:20:58.541Z   <- B only refreshed at 22:20:58 (36s old)
```

After the tag revalidation, the page expiration is recomputed as
`now + min(fetch revalidates) = now + 20s`, ignoring that B's cache entry only had
4s of life left. B is therefore served 16s past its `revalidate: 20`.

## Expected

The regenerated page's expiration should be the earliest of the newly computed
value and the remaining lifetime of the fetch entries reused from cache, so B
refreshes at its own deadline.
