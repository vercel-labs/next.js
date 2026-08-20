# Repro: Server Action re-render bypasses the Data Cache of unrelated tagged fetches (issue #61542)

Minimal, database-free reproduction of https://github.com/vercel/next.js/issues/61542.

## What it shows

A statically prerendered page renders two cached `fetch` calls against a local upstream server
that counts every request it actually receives:

- `fetch(...?key=todos, { next: { tags: ['todos'] } })`
- `fetch(...?key=other, { next: { tags: ['other-tag'] } })`

A Server Action calls `revalidateTag('todos')` only.

Expected: only the `todos` fetch is refetched; the `other-tag` fetch keeps serving from the Data Cache.

Observed on **Next.js 14.1.0**: every Server Action invocation also re-issues the `other-tag`
fetch (the Server Action request carries `cache-control: no-store`, so the render triggered by the
action bypasses the Data Cache for *all* fetches on the page), matching the report.

## Run

```bash
npm install
npx playwright install chromium-headless-shell
./run-all.sh   # fresh upstream + next build + next start + Playwright check
```

`run-all.sh` prints the upstream hit counters after each step and exits non-zero when the
`other-tag` fetch was refetched by the Server Action.

### Observed output with `next@14.1.0` (reproduces)

```
build stats: {"todos":1,"other":1}
1-initial-load:            todos 1 | other 1 | upstream hits={"todos":1,"other":1}
2-after-reload:            todos 1 | other 1 | upstream hits={"todos":1,"other":1}
3-after-server-action-1:   todos 2 | other 2 | upstream hits={"todos":2,"other":2}
4-after-server-action-2:   todos 3 | other 3 | upstream hits={"todos":3,"other":3}
FAIL: server action re-fetched the unrelated 'other-tag' fetch (Data Cache bypassed)
```

### Newer versions

With `next@15.5.7` (and `cache: 'force-cache'` added to both fetches, required by the Next 15
fetch-caching defaults) the same script passes: the Server Action refetches only the `todos`
fetch, the `other-tag` fetch stays cached.

With `next@16.3.1` (`revalidateTag('todos', 'max')`) neither fetch is re-issued during the two
Server Action invocations, so the unrelated fetch is not invalidated either.
