# Repro: `next/navigation` `router.push()` is not awaitable (issue #61737)

App Router's `useRouter().push()` returns `undefined`, so `await router.push(...)`
resolves immediately, before the navigation finishes. Pages Router's
`next/router` `push()` returns a `Promise<boolean>` that resolves after the
navigation completes.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000  (app router)  and click the button
# open http://localhost:3000/legacy (pages router) and click the button
```

Both target routes take 2000ms to render on the server (`app/slow/page.js`,
`pages/legacy-slow.js` via `getServerSideProps`).

## Observed (Next.js 16.3.1, dev, Turbopack)

app router (`/`):
```
typeof push() return = undefined
push() returned a thenable = false
await push() resolved after 7ms
pathname after await = /            <- navigation not done yet
```

pages router (`/legacy`):
```
typeof push() return = object
push() returned a thenable = true
await push() resolved after 2185ms
pathname after await = /legacy-slow  <- navigation done
```
