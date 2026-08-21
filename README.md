# Reproduction: VSCodium is not detected on macOS when clicking error-overlay links

Reproduction for https://github.com/vercel/next.js/issues/94077 with `next@16.3.0-canary.28`.

The bug lives in `next/dist/next-devtools/server/launch-editor.js` and is macOS-only,
so this repro **simulates macOS** and therefore also runs on Linux/CI:
`process.platform` is reported as `darwin` *only* to that module, `ps x` returns a
canned macOS process list with VSCodium running, and a fake `/Applications/VSCodium.app`
bundle mirrors the file layout of the real release
(verified against `VSCodium-darwin-arm64-1.126.04524.zip`):

```
VSCodium.app/Contents/MacOS/VSCodium
VSCodium.app/Contents/Resources/app/bin/codium
```

Next.js instead looks for `/Applications/VSCodium.app/Contents/MacOS/Electron`
and maps it to `.../Resources/app/bin/code`; neither path exists, and
`getArgumentsForLineNumber` has no `codium` case.

## Run

```bash
npm install

# 1) unit-level: guessEditor() + getArgumentsForLineNumber() against a real VSCodium layout
npm run repro

# 2) end to end: real `next dev`, fake macOS with VSCodium running
npm run dev:fake-macos          # terminal 1 (writes the server log you need to read)
npm run click-open-in-editor    # terminal 2, same as clicking "Open in editor"
```

Note: `npm` sets `EDITOR=vi` for scripts, which would mask the failure with an
`osascript` fallback, so `dev:fake-macos` unsets `EDITOR`/`VISUAL`/`REACT_EDITOR`.

## Observed output

`npm run repro`:

```
=== 1. guessEditor() with VSCodium running (what a real Mac reports) ===
ps x contains: /Applications/VSCodium.app/Contents/MacOS/VSCodium

Could not open page.tsx in the editor.

=== 2. Next.js COMMON_EDITORS_MACOS VSCodium mapping vs. real bundle ===
mapping in installed next: [
  "'/Applications/VSCodium.app/Contents/MacOS/Electron': '/Applications/VSCodium.app/Contents/Resources/app/bin/code',"
]
bundle has Contents/MacOS/Electron  -> false
bundle has Contents/MacOS/VSCodium  -> true
bundle has Resources/app/bin/code   -> false
bundle has Resources/app/bin/codium -> true

=== 3. getArgumentsForLineNumber() for the real VSCodium CLI (codium) ===
codium received argv: /path/to/app/page.tsx
BUG: no "-g <file>:3:3", editor opens at line 1
```

Dev server log after clicking "Open in editor" in the overlay:

```
Could not open page.tsx in the editor.

To set up the editor integration, add something like REACT_EDITOR=atom to the .env.local file ...
```

Expected: VSCodium is detected, launched via `.../Resources/app/bin/codium`,
and opened with `-g <file>:<line>:<column>`.
