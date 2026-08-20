# next#63255 - "multiple modules with names that only differ in casing" on Windows

Reproduction material for https://github.com/vercel/next.js/issues/63255 (issue #63255).

The reporter's repo (https://github.com/gsaint12/afiaweb, `next@14.1.3`) starts and
compiles cleanly on Linux (`✓ Compiled / in 3s (511 modules)`), so the crash is not in
the app code: it needs a case-insensitive filesystem, i.e. Windows (or macOS APFS-CI).
As noted in the issue thread, it happens when the project directory is entered with the
wrong casing (`cd c:\users\me\myapp` while the real dir is `C:\Users\Me\MyApp`), which
Windows allows. Webpack then sees the same next-internal modules under two casings.

## Why Next.js does not warn about it on Windows

`packages/next/src/lib/get-project-dir.ts` already guards against this:

```ts
const realDir = realpathSync(resolvedDir)
if (resolvedDir !== realDir && resolvedDir.toLowerCase() === realDir.toLowerCase()) {
  warn(`Invalid casing detected for project dir, ...`)
}
return realDir
```

but `packages/next/src/lib/realpath.ts` (unchanged on canary) is:

```ts
export const realpathSync = isWindows ? fs.realpathSync : fs.realpathSync.native
```

The pure-JS `fs.realpathSync` does not canonicalise path casing, so on Windows -
the only platform where a wrong-cased `cd` is possible - `resolvedDir === realDir`
always holds: no warning is printed and the wrong-cased dir is kept for the whole
webpack compilation. `fs.realpathSync.native` (used everywhere else) does return the
on-disk casing.

## Reproduce on Windows (original report)

```
mkdir %USERPROFILE%\Desktop\MyApp
cd %USERPROFILE%\Desktop\MyApp
npx create-next-app@14.1.3 .          :: or clone this folder and npm install
cd /d %USERPROFILE%\desktop\myapp     :: same dir, wrong casing - Windows allows it
npm run dev
```

Expected: a warning about the project dir casing (or a normalised dir).
Actual: no warning, and the dev compilation emits
`There are multiple modules with names that only differ in casing` for
`next/dist/compiled/@next/react-refresh-utils/dist/loader.js`,
`next/dist/build/webpack/loaders/next-flight-client-module-loader.js`,
`next/dist/build/webpack/loaders/next-swc-loader.js`,
`next/dist/shared/lib/utils/warn-once.js`.

## Demo of the working (non-Windows) code path

```
npm install
npm run demo
```

`scripts/linux-casing-demo.sh` emulates a wrong-cased project dir on Linux with a
symlink whose name differs from the real directory only in case and starts
`next dev <wrong-cased-dir>`. Output:

```
 ⚠ Invalid casing detected for project dir, received /tmp/.../myapp actual path /tmp/.../MyApp
 ✓ Compiled / in 1.8s (408 modules)
GUARD FIRED (realpathSync.native path) - dir normalised, build is clean
```

Because `realpathSync.native` is used on Linux, the guard fires and the build is clean -
exactly the code path that is disabled on Windows.
