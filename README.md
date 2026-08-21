# Reproduction: vercel/next.js#80602 — basePath/assetPrefix not applied to all assets

App Router app with:

```js
// next.config.mjs
output: 'standalone', basePath: '/myapp', assetPrefix: '/myapp'
```

## Run

```bash
npm install
npm run build
npm run start:standalone   # serves on :3000, app at /myapp
node verify.mjs            # prints emitted asset URLs + status codes
```

## Observed (next@16.3.1-canary.26, also next@14.2.35)

* Metadata icons are emitted with **no** basePath: `<link rel="icon" href="/favicon.ico">`,
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` → both `404`
  (`/myapp/favicon.ico` is `200`).
* `priority` preload for a `public/` image: `<link rel="preload" as="image" href="/logo.png">` → `404`.
* `<Image src="/logo.png">` (string src pointing at `public/`) emits
  `/myapp/_next/image?url=%2Flogo.png` — the `url` param is missing the basePath, so the
  optimizer fetches `/logo.png` (404) and the request returns
  `400 The requested resource isn't a valid image.`
  The same request with `url=%2Fmyapp%2Flogo.png` returns `200`.
* `<Image src={staticImport} />` and `/_next/static/*` scripts are prefixed correctly.

So under `basePath`, framework-generated URLs are inconsistent: chunks and static-import
images get the prefix, while metadata icons/openGraph images, image preloads and the
image-optimizer `url` param for `public/` assets do not.
