# Repro: `@next/eslint-plugin-next` named ESM exports missing (vercel/next.js#86504)

The reporter's linked repo (https://github.com/thernstig/eslint-mcp-jiti) returns 404, so this is a
minimal standalone reproduction.

## Run

```sh
npm install
node repro.mjs        # or: node -e "import {configs} from '@next/eslint-plugin-next';"
```

## Expected
Exits 0, printing the config names.

## Actual
```
SyntaxError: Named export 'configs' not found. The requested module
'@next/eslint-plugin-next' is a CommonJS module, which may not support all
module.exports as named exports.
```

## Cause
`dist/index.js` (SWC `_export` helper) installs accessor properties:

```js
_export(exports, { configs: function() { return configs }, default: ..., rules: ... })
```

`cjs-module-lexer` cannot statically detect getters installed via a helper, so Node creates only
`default` (and `module.exports`) synthetic exports:

```sh
node -e "import('@next/eslint-plugin-next').then(m=>console.log(Object.keys(m)))"
# [ '__esModule', 'default', 'module.exports' ]
```

Default import works: `import plugin from '@next/eslint-plugin-next'; plugin.configs`.

Affects `@next/eslint-plugin-next` 16.0.4 (reported) and 16.3.1 (latest) on Node 24.
