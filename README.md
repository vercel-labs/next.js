# Repro: next.js#98148 — `?constructor=1` 500s any App Router page (Next 15.x)

App Router page awaits `searchParams`. A query key literally named `constructor`
shadows `Promise.prototype.constructor` on the searchParams promise instance
(`makeUntrackedExoticSearchParams` / dev variant `Object.defineProperty` every raw key
onto the promise, and `wellKnownProperties` in `shared/lib/utils/reflect-utils.js`
does not list `constructor`). V8's `SpeciesConstructor` step in `.then()` then throws.

## Run

```
npm install
npm run build && npm run start   # http://localhost:3001
curl -o /dev/null -w '%{http_code}\n' 'http://localhost:3001/?foo=1'          # 200
curl -o /dev/null -w '%{http_code}\n' 'http://localhost:3001/?constructor=1'  # 500
```

`npm run dev` (port 3000) reproduces too.

Server log:

```
 ⨯ TypeError: The .constructor property is not an object
    at Promise.then (<anonymous>) { digest: '4027806745' }
```

## Mechanism only (no framework)

`node mechanism.js` → `TypeError: The .constructor property is not an object`

## Version matrix (verified in this sandbox)

| version | `GET /?constructor=1` |
| --- | --- |
| 15.5.4 | 500 (dev + prod) |
| 15.5.25 (latest 15.x backport) | 500 |
| 16.3.4 (latest) | 200 |
| 16.4.0-canary.13 | 200 |
