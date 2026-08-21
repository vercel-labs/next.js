# Repro: static image imported from an npm package is a plain string under Turbopack (#81964)

`my-assets` is a tiny package installed from a tarball (so it lives as a real copy in
`node_modules`, not a symlink) and re-exports a statically imported PNG:

```js
// node_modules/my-assets/index.js
import logo from './logo.png';
export { logo };
```

## Run

```bash
npm install
npm run dev          # next dev --turbopack  -> http://localhost:3001
npm run dev:webpack  # next dev (webpack)    -> http://localhost:3002
```

* `/` renders `<Image src={logo} />`
* `/raw` prints `typeof logo` and the value

## Observed (next 15.4.3 and 16.3.1-canary.26)

| bundler | `typeof logo` | `/` |
| --- | --- | --- |
| Turbopack | `string` (`/_next/static/media/logo.<hash>.png`) | 500 `Image with src "..." is missing required "width" property.` |
| webpack | `object` (`{src,width,height,blurDataURL,...}`) | 200, image renders |

Adding `transpilePackages: ['my-assets']` to `next.config.mjs` makes Turbopack emit the
full static-image metadata object, so the difference is limited to non-transpiled
node_modules code.
