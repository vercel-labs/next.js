# Repro: [cacheComponents] forward navigation restores state from a previously-visited page (vercel/next.js#91540)

Minimal reproduction of https://github.com/vercel/next.js/issues/91540 on `next@16.3.1`.

- `/a` renders a client `<Counter>` (`useState`) plus a `<Link>` to `/b`.
- `/b` renders a `<Link>` back to `/a`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # cacheComponents: true (default here)
npm run e2e            # in a second terminal
```

## Observed with `cacheComponents: true` (next 16.3.1)

| navigation to `/a`        | expected    | actual      |
| ------------------------- | ----------- | ----------- |
| `<Link href="/a">` click  | `count: 0`  | `count: 2`  |
| browser Back              | `count: 2`  | `count: 2`  |

`e2e/forward-nav.spec.ts` → "forward navigation (link click) to page A should render
a fresh instance" fails with `Received: "count: 2"`.

## Control: `CACHE_COMPONENTS=false npm run dev`

Link click to `/a` renders `count: 0` (test passes). Note the Back-button test then
fails with `count: 0`: without cacheComponents App Router does not restore client
state on Back either, so the "before" behavior in the issue body is only half true.

## `key={useRouter().bfcacheId}` opt-out (#93633)

`e2e/keyed-workaround.spec.ts` passes on 16.3.1: `/keyed-a` keys the counter by
`router.bfcacheId`, giving a fresh instance on link click *and* restored state on Back.

Note: hidden `<Activity>` subtrees stay in the DOM, so all locators in these specs are
scoped with `.filter({ visible: true })`.
