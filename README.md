# next.js#70834 — "attempted to get private field on non-instance"

Minimal reproduction of https://github.com/vercel/next.js/issues/70834

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 and check the browser console
```

Client-side error on hydration:

```
TypeError: attempted to get private field on non-instance
  at _class_extract_field_descriptor (@swc/helpers/esm/_class_extract_field_descriptor.js)
  at get test (app/construct.js)
  at Home (app/page.js)
```

## Cause

`app/construct.js` uses an arrow function whose expression body is
`new class { #test = 99; get test() { return this.#test } }`.

When SWC downlevels private fields, the WeakMap init is emitted *inside* the
`new` expression, so a fresh WeakMap is created and reassigned to the shared
`_test` binding on every call:

```js
var _test;
const construct = () => new (_test = new WeakMap(), class { ... });
```

The instance retained by `useRef` was branded in the previous WeakMap, so the
second dev render (React double render) makes `this.#test` fail the brand check.

## Observed matrix (verified)

| Version | Mode | Result |
| --- | --- | --- |
| 14.2.15 | `next dev` (webpack) | throws |
| 15.0.1 | `next dev` (webpack) | throws |
| 15.5.7 | `next dev` (webpack) | throws |
| 15.5.7 | `next build && next start` | OK |
| 16.3.1 | `next dev` (turbopack/webpack, default browser targets) | OK (private fields kept native) |
| 16.3.1 | `next dev --webpack` + `.browserslistrc` of `chrome 60` | throws |

Workarounds: use a block body (`() => { return new class {...} }`), or a named
class declared outside the arrow function.
