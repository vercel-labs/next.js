# Repro: issue #84450 — extraneous `@emnapi/runtime` after create-next-app install

## Run

```bash
bash repro.sh
```

(or `npm run repro` with any npm)

## Result on Linux x64 / Node 24

`npm@10.9.2 ls` after a clean install of the default `create-next-app`
dependency set reports the wasm fallback packages as extraneous:

```
├── @emnapi/core@1.10.0 extraneous
├── @emnapi/runtime@1.11.3 extraneous
├── @emnapi/wasi-threads@1.2.1 extraneous
├── @napi-rs/wasm-runtime@1.2.3 extraneous
├── @tybys/wasm-util@0.10.3 extraneous
```

`npm@11.13.0 ls` on the exact same `package.json` reports **no** extraneous
packages.

Notes:
- No postinstall script is involved; the packages are optional deps of
  `@img/sharp-wasm32` (via `next`), `@tailwindcss/oxide-wasm32-wasi` and
  `@unrs/resolver-binding-wasm32-wasi` (via `eslint-config-next`), which npm 10
  hoists to the project root without recording them as dependencies.
- Each dependency installed alone (only `next`, only `tailwindcss`, only
  `eslint-config-next`) produces no extraneous entries under npm 10; it needs
  two or more of them.
- Still reproduces with the latest versions (`next@16.3.1`,
  `tailwindcss@4.3.3`) under npm 10, including `@img/sharp-wasm32@0.35.3`.
