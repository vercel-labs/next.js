# Repro: `Failed to load SWC binary for android/arm64` (vercel/next.js#67825)

Next.js has published **no `@next/swc-android-arm64` binary since 13.2.4**, and it is
not listed in `next`'s `optionalDependencies` from 13.3 onward. On Android arm64
(Termux / code-server) `next dev` therefore cannot load a native binding, and the
download fallback hits a 404 on the npm tarball.

No Android device required: `spoof-android.cjs` / `repro.mjs` force
`process.platform = 'android'` and `process.arch = 'arm64'`.

## Run

```bash
npm install
npm run repro   # download fallback -> HTTP 404 for @next/swc-android-arm64@14.1.0
npm run dev     # ⨯ Failed to load SWC binary for android/arm64
```

## Observed (next 14.1.0)

```
   Downloading swc package @next/swc-android-arm64...
 ⨯ Failed to download swc package from https://registry.npmjs.org/@next/swc-android-arm64/-/swc-android-arm64-14.1.0.tgz
Error: request failed with status 404
```

```
 ⚠ Attempted to load @next/swc-android-arm64, but it was not installed
 ⨯ Failed to load SWC binary for android/arm64, see more info here: https://nextjs.org/docs/messages/failed-loading-swc
```

Latest published `@next/swc-android-arm64` version: `13.2.4`
(`npm view @next/swc-android-arm64 dist-tags`).
