# Repro: jest.mock ignored with `@jest/globals` + `next/jest` (vercel/next.js#43888)

    npm install && npm test

Result: `hello.test.js` (imports `jest` from `@jest/globals`) FAILS — the
`jest.mock('./greet', ...)` factory is ignored, so `hello('Jane')` returns
`"Hello Jane"` instead of `"Hola Jane"`.
`hello-global.test.js` (identical, but uses the `jest` global) PASSES.

Only difference between the two files is the `import {jest} from '@jest/globals'`
line, i.e. next/jest's SWC transform does not hoist `jest.mock()` calls when
`jest` comes from `@jest/globals`. Removing the `next/jest` wrapper in
`jest.config.js` also makes both tests pass.

Verified with next 13.0.7-canary.3 (as reported) and next 16.3.1-canary.25.
