# Repro: vercel/next.js#51260 — `<Link href="#hash">` does not activate the CSS `:target` selector

Minimal app-router repro. `<Link>` and `<a>` both jump to `#1/#2/#3`.

## Run

```bash
npm install
npm run dev
# in another shell
npm run test:target   # Playwright: compares <a> vs <Link>
```

## Result on next@16.3.1-canary.25 (dev and `next build && next start`)

| navigation | element top after jump | `:target` matches |
| --- | --- | --- |
| `<a href="#3">` | 100 (scroll-margin-top honored) | **true** |
| `<Link href="#3">` | 100 (scroll-margin-top honored) | **false** |

So the originally reported `scroll-margin-top` and `scroll-behavior: smooth` parts of the
issue no longer reproduce, but `:target` still never matches after a `<Link>` hash
navigation, because the router sets the hash without a real document fragment navigation.
`app/globals.css` styles `:target` with a red outline + text so this is visible in the browser.
