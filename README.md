# Repro: `module.generator.asset.filename` breaks `asset/inline` (issue #34501)

Next.js sets `config.module.generator.asset = { filename: 'static/media/[name].[hash:8][ext]' }`,
which webpack applies to **all** asset module subtypes, including `asset/inline`, where
`filename` is not a valid generator option. Any custom loader chain that emits inline assets
(e.g. `css-loader` handling a `data:` URL in CSS, or `type: 'asset/inline'` rules) fails.

## Run

```bash
npm install --legacy-peer-deps
npx next build --webpack
```

## Expected
Build succeeds (as on next@11).

## Actual (next@16.3.1-canary.25)
```
./styles/globals.css
Module not found: Invalid generator object. Asset Modules Plugin has been initialized using a generator object that does not match the API schema.
 - generator has an unknown property 'filename'. These properties are valid:
   object { binary?, dataUrl? }
   -> Generator options for asset/inline modules.
```

Workaround (moving `generator.asset` to `generator['asset/resource']`) makes the same build pass.
