# Turbopack fails to parse Flow syntax in `react-native` (vercel/next.js#86784)

Minimal repro: a client component imports `react-native-safe-area-context`, which
imports `react-native/Libraries/Utilities/codegenNativeComponent` — a file published
with Flow types. Turbopack parses `node_modules` JS as plain ECMAScript and errors.

## Run

```sh
npm install
npm run dev   # then open http://localhost:3000 -> 500 / build error
```

Expected error:

```
./node_modules/react-native/Libraries/Utilities/codegenNativeComponent.js:13:13
Error: Expected ',', got '{'
> 13 | import type {HostComponent} from '../../src/private/types/HostComponent';
Parsing ecmascript source code failed
```

Reproduced with next 15.5.0 and next@canary (16.3.1-canary.26), `next dev --turbopack`
and `next build --turbopack`.

## Extra note

`next.config.rnw.js` shows the suggested workaround (`turbopack.resolveAlias`
mapping `react-native` -> `react-native-web` plus `.web.*` resolveExtensions).
It does **not** help, because `react-native-safe-area-context` imports the deep
subpath `react-native/Libraries/Utilities/codegenNativeComponent`, which the
bare-specifier alias does not cover.
