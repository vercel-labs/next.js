# Repro: next.js#92497 — TypeError: Cannot redefine property: default

`next.config.js` exports a falsy value (`module.exports = null`). `interopDefault(mod)`
falls through to the module namespace object, and `Object.freeze()` on that ESM namespace
throws a cryptic `TypeError: Cannot redefine property: default`, killing `next dev` and `next build`.

## Run
```bash
npm install
npm run dev   # crashes; also: npm run build
```

Control: change `next.config.js` to `module.exports = {}` and dev serves 200.
