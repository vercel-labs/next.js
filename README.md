# Reproduction harness for vercel/next.js#53117 — "Revalidation of multiple tags at once fails"

Verifies whether calling `revalidateTag` / `revalidatePath` more than once during a single
request only revalidates some of the targets.

## Layout

- `data-server.js` — upstream origin on :3001 returning `{ now: Date.now() }`
- `app/api/tags` — fetches the upstream 5x with `cache: 'force-cache'` and tags `tag1..tag5`
- `app/api/revalidate` — calls `revalidateTag(tag, 'max')` for all 5 tags in one request
- `app/api/revalidate-one?tag=tag1` — control: single `revalidateTag` call
- `app/a`, `app/b` — ISR pages (`revalidate = 3600`) printing their render timestamp
- `app/api/revalidate-paths` — `revalidatePath('/a')` + `revalidatePath('/b')` in one request
- `app/action` — Server Action variants of both (two buttons)
- `testpaths.sh`, `pw-test.mjs` — curl / Playwright drivers

## Run

```bash
npm install
npx playwright install chromium
npm run data &          # upstream on :3001
npm run build
npm start &             # Next on :3000
./testpaths.sh          # multiple revalidatePath in one request
node pw-test.mjs        # Server Action variants (paths + tags)
```

`revalidateTag` requires a cache-life profile in Next 16 (`revalidateTag(tag, 'max')`).

## Result on next@16.3.1-canary.25 (node 24): all targets revalidate

Route handler, 5 tags in one request (values change for every tag after one refresh,
stale-while-revalidate means the first request after revalidation still serves stale):

```
before: tag1..tag5 = 1787253242542..544
after:  tag1..tag5 = 1787253246579..580
```

Route handler, two paths in one request:

```
before: A:1787253801948  B:1787253801969
after:  A:1787253805030  B:1787253805046
```

Server Action:

```
paths after server action: A:1787253858272 B:1787253858284
tags  after server action: tag1/tag2 updated, tag3-5 untouched (as expected)
```

The same harness on `next@15.1.4` also revalidates every tag and both paths.
