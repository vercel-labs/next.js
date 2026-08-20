# vercel/next.js#67763 — getServerSideProps on browser back/forward (pages router)

Harness for "Click the browser forward and back, and getServerSideProps does not re-execute".
Mirrors the reporter's demo (https://github.com/rick-liruixin/next-getServerSideProps-bug-demo):
a `pages/categories/[...url].jsx` catch-all page with `getServerSideProps`, a shallow
`router.replace`/`router.push` that bumps a `page` query param, and client navigations between
slugs of different depth (`women/ready-to-wear.html` -> `women.html` -> `women/shoes.html`).

`getServerSideProps` counts its invocations server-side and the count is rendered as `#hits`, so a
missing re-execution is visible without reading the network panel (the scripts also count
`/_next/data/` requests).

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm run start &          # or: npm run dev
npm run test:back-forward                 # shallow replace, push 2 slugs, back x2, forward x2
npm run test:shallow-push                 # shallow push entries, back x3, forward x3
npm run test:rapid                        # rapid back/back/forward/forward, checks stale props
```

Replace-call shape is selectable with `?style=object|string|string-as-undefined|push` on the page
URL (`router.replace(urlObject, as, {shallow:true})`, `router.replace(path, path, ...)`,
`router.replace(path, undefined, ...)`, shallow `router.push`).

## Result on next@16.3.1 and next@13.5.6 (the reported version)

Every `history.back()` / `history.forward()` issues a fresh `/_next/data/...json` request and the
`#hits` counter increments, i.e. `getServerSideProps` re-executes. No stale props were observed,
including with a 700 ms artificial delay inside `getServerSideProps` and rapid pop navigations.
