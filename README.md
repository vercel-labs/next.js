# Repro for vercel/next.js#70661

Static (prerendered) App Router route issues a fresh `?_rsc=` request on every
client-side navigation *after the first* click, even though the route was
prefetched and is fully static.

The reporter's linked repo (`MariuzM/test__next`) is deleted (HTTP 404), so this
is a minimal re-creation using the exact versions from the issue report
(next 15.0.0-rc.0 / react 19.0.0-rc-fb9a90fa48-20240614).

## Run

```bash
npm install --legacy-peer-deps
npm run build
npm start           # next start -p 3130
# in another shell:
npx playwright install chromium
PORT=3130 npm run check
```

## Observed on next@15.0.0-rc.0 (production build, `next start`)

```
click #1 on <Link href="/about"> (static, prerendered):
  +81ms /about content rendered
click #2 on <Link href="/about"> (static, prerendered):
  +36ms REQUEST /about?_rsc=1ea1r
  +40ms RESPONSE 200 /about?_rsc=1ea1r
  +46ms /about content rendered
click #3 on <Link href="/about"> (static, prerendered):
  +37ms REQUEST /about?_rsc=1ea1r
  +40ms RESPONSE 200 /about?_rsc=1ea1r
```

First click is served from the prefetch cache with zero network activity; every
later click re-fetches the static RSC payload.

## Same test on newer versions (no extra request on repeat clicks)

15.1.4, 15.2.1, 15.5.23 and 16.3.1 all show `(no _rsc requests)` for clicks
#2 and #3, i.e. the behavior reported in the issue body is no longer
reproducible on maintained releases with this minimal app. (On 16.3.1 the
initial viewport prefetch is issued twice per link, which is unrelated.)
