# Reproduction: next#86785 — legacy JS polyfills shipped to modern browsers

`next-polyfill-module` is always bundled into a regular (module, not `nomodule`)
`<script>` chunk, even when `browserslist` only targets Chrome/Edge/Firefox 111 and
Safari 16.4, where every polyfill except `URL.canParse` is unnecessary. Lighthouse
reports these as "Legacy JavaScript".

## Run

```bash
npm install
npm run build            # Turbopack
node check-polyfills.mjs # prints the loaded chunk containing the polyfills
npm start                # open http://localhost:3000 and run Lighthouse

npx next build --webpack # same result with webpack
node check-polyfills.mjs
```

`browserslist` in package.json is already set to modern targets only.
