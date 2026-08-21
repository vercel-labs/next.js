# Issue #76957 — does `revalidateTag` still wipe the whole client Router Cache?

The issue asks the `revalidateTag` docs to disclose that calling it from a Server Action
invalidates the **entire** client-side Router Cache and re-renders the current route,
regardless of the tag (as the `revalidatePath` docs do).

This repro measures that directly.

* `/` — Server Action that calls `revalidateTag('totally-unrelated-tag')`. No page in this
  app uses that tag.
* `/b` — dynamic page printing a server render timestamp.
* `next.config.js` — `experimental.staleTimes = { dynamic: 300, static: 300 }`, so `/b`
  normally stays in the client Router Cache across client-side navigations.

`test.spec.js`:
1. client-navigate `/` -> `/b` -> `/` -> `/b`, assert the timestamp is unchanged (Router Cache hit),
2. run the Server Action with the unrelated tag,
3. client-navigate to `/b` again and assert the timestamp is *still* unchanged
   (i.e. the unrelated tag did not evict `/b`).

## Run

```bash
npm install --legacy-peer-deps
npx playwright install chromium
npm run build
npm start &            # server on :3000
npx playwright test
```

## Results

| next | step 3 result |
| --- | --- |
| `16.3.1` | test **passes** — `/b` still served from the Router Cache; unrelated tag did not evict it |
| `15.2.4` (`npm i next@15.2.4 react@18.3.1 react-dom@18.3.1 --legacy-peer-deps`, and drop the `'max'` 2nd arg in `app/actions.js`) | test **fails** — `/b` re-renders with a new timestamp, i.e. the whole Router Cache was invalidated by an unrelated tag |
