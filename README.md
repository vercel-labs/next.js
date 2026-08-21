# Repro: next.js#89377 — standalone output omits the instrumentation hook when `pageExtensions` is set

Minimal reproduction of https://github.com/vercel/next.js/issues/89377

## Run

```bash
npm install
npm run build
npm run start:standalone   # -> open http://localhost:3000
```

## Observed (Next 16.2.0-canary.23)

- `.next/server/instrumentation.js` IS emitted by the build.
- `.next/standalone/.next/server/instrumentation.js` is MISSING, so `register()` never runs.
- Page renders `instrumentation registered: false`; server log prints `instrumentation registered: undefined`.
- `npm start` (`next start`) on the exact same build DOES run the hook and logs `INSTRUMENTATION REGISTERED nodejs`.

## Expected

The standalone server runs `register()` just like `next start` does.

## Trigger

Removing `pageExtensions` from `next.config.js` (and renaming the files to
`instrumentation.js` / `pages/index.js`) copies `instrumentation.js` into
`.next/standalone/.next/server/` and the hook runs again. Consistent with the strict
`fileBaseName === INSTRUMENTATION_HOOK_FILENAME` check, where
`"instrumentation.page" !== "instrumentation"`.
