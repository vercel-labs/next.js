# Repro: `router.replace` restores stale hash on dynamic param routes (vercel/next.js#96643)

Next.js 16.3.0 (and 16.3.1-canary.1) restore the hash from the *initial* URL when
`router.replace(pathname)` is called on a **dynamic param route** entered directly with a hash.

## Run

```bash
npm install
npm run build
npm start                      # http://localhost:3000
# in another shell:
npm i -D playwright && npx playwright install chromium
node verify.mjs
```

## Observed (next 16.3.0)

```
dynamic /p/123#modal -> click -> history.replaceState(..., "/p/123#modal")   # BUG, url unchanged
static  /#modal      -> click -> history.replaceState(..., "/")              # correct
```

On next 15.5.9 the dynamic route correctly yields `replaceState(..., "/p/123")`.

Manual repro: open `http://localhost:3000/p/123#modal` in a new tab, click the button.
The URL stays `/p/123#modal`.
