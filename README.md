# Repro: `useSelectedLayoutSegments` includes an extra leading slot segment in parallel routes (vercel/next.js#81317)

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/example5/bar
```

## Expected (per docs)

`useSelectedLayoutSegments('header')` → `["bar"]`

## Actual

| Next.js | `useSelectedLayoutSegments('header')` | `useSelectedLayoutSegment('header')` |
| --- | --- | --- |
| 14.2.35 | `["children","bar"]` | `"bar"` |
| 15.5.4  | `["(slot)","bar"]` | `"bar"` |
| 16.3.1  | `["(__SLOT__)","bar"]` | `"bar"` |

`useSelectedLayoutSegment` normalizes the value (`computeSelectedLayoutSegment` picks the last
segment for non-`children` parallel route keys), but `useSelectedLayoutSegments` returns the raw
path from `getSelectedLayoutSegmentPath`, which starts with the slot's own branch key. This is
undocumented; in recent versions the leading value is even an internal placeholder
(`(slot)` / `(__SLOT__)`), not `"children"`.

Change `next` in package.json to reproduce on other versions.
