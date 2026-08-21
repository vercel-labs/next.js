# Repro: extended Set methods are not polyfilled for module-capable browsers (vercel/next.js#74978)

Next.js ships `next-polyfill-nomodule` (which does `import 'core-js/features/set'`)
in `polyfills-*.js`, but that script is injected with `nomodule`. Browsers that
support ES modules but predate `Set.prototype.union` (Chrome 103, released 2022)
never execute it, so a client component calling `.union()` throws
`TypeError: ....union is not a function` during hydration.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start -- -p 3100 &   # http://localhost:3100
npm run check
```

`check.mjs` loads the page twice with Playwright: once with
`delete Set.prototype.union` injected before any page script (simulating
Chrome 103) and once unmodified.

## Expected output

```
=== simulated browser without native Set.prototype.union: true
nomodule (polyfill) script tags: ["/_next/static/chunks/<polyfills-hash>.js"]
Set.prototype.union after load: undefined
rendered: null
errors: [ 'console: TypeError: (intermediate value).union is not a function' ]
=== simulated browser without native Set.prototype.union: false
Set.prototype.union after load: function
rendered: 'Test Set Union 3'
errors: []
```

The polyfill bundle does contain the polyfill — injecting
`/_next/static/chunks/polyfills-<hash>.js` manually makes
`Set.prototype.union` a function — it is simply never run by module-capable
browsers.
