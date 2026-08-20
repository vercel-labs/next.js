# Repro: next >14.0.1 pages router cannot import `@ant-design/icons` (SyntaxError: Unexpected token 'export')

Issue: https://github.com/vercel/next.js/issues/65707
(The reporter's original repo is now 404, so this is a minimal recreation.)

## Steps

```
npm install
npx next build      # fails while "Collecting page data"
# or
npx next dev        # GET / -> 500
```

## Observed

* Node 18 (no `require(esm)`): `SyntaxError: Unexpected token 'export'` at
  `node_modules/@ant-design/icons-svg/es/asn/ReloadOutlined.js:3`
* Node 20/24 (`require(esm)` enabled): `ERR_MODULE_NOT_FOUND: Cannot find module
  .../rc-util/es/Dom/canUseDom imported from .../rc-util/es/Dom/dynamicCSS.js`

Both come from the same cause: the server bundle keeps `@ant-design/icons` deps
external and loads their extension-less ESM `es/` files from a CJS bundle.

## Version matrix (verified in this repro, pages router, webpack)

| next | result |
| --- | --- |
| 14.2.3 | fails |
| 15.1.2 | fails |
| 15.2.4 | fails |
| 15.3.5 | fails |
| 15.4.7 | builds |
| 15.5.4 | builds |
| 16.3.1 | builds |

Workaround on affected versions: `transpilePackages: ['@ant-design/icons', '@ant-design/icons-svg', 'rc-util']`.
