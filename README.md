# Repro: next/link `prefetch={true}` breaks navigation under `output: 'export'` (#88032)

## Run

```bash
npm install
npm run build
npx serve out -p 3000   # any static file server
# in another shell
npx playwright install chromium
npm test
```

## Result

```
/blog2 auto  NAVIGATED   (only prefetch=auto links -> works)
/blog2 auto2 NAVIGATED
/blog3 true  STUCK       (only prefetch={true} links -> click does nothing)
/blog3 true2 STUCK
/blog  auto  STUCK       (mixed auto + prefetch={true} to same href -> ALL links dead)
/blog  true  STUCK
/blog  auto2 STUCK
```

No console errors, no failed (non-2xx) requests.

## Why

`prefetch="auto"` fetches the exported per-segment files
(`/blog/post-1/__next._tree.txt`, ... `text/plain`, valid RSC).

`prefetch={true}` (full prefetch) additionally fetches `/blog/post-1?_rsc=<hash>`.
A static export/static host ignores the query string and returns the prerendered
**HTML document** (`content-type: text/html`) instead of an RSC payload. That
response is stored in the client route cache for `/blog/post-1`, and every later
soft navigation to that href silently does nothing.
