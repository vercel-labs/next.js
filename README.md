# Repro: Next.js mangles duplicate `--require` entries in NODE_OPTIONS (Yarn PnP + VS Code debugger)

Issue: https://github.com/vercel/next.js/issues/72621

`next dev` re-serializes `NODE_OPTIONS` for its child processes with
`getFormattedNodeOptionsWithoutInspect()` (`packages/next/src/server/lib/utils.ts`).
`parseNodeArgs()` stores flags in an object, so two `--require` flags collapse into a
single value joined by a space and are re-emitted as one `--require="a b"`, which Node
then fails to resolve.

That is exactly what happens with Yarn PnP (Yarn injects `--require <project>/.pnp.cjs`)
plus the VS Code JavaScript debugger (js-debug injects `--require .../bootloader.js`).

## Run (no VS Code needed)

```bash
yarn install
NODE_OPTIONS="--require \"$PWD/fake-vscode-bootloader.js\"" yarn run dev
```

`fake-vscode-bootloader.js` stands in for the VS Code js-debug bootloader; Yarn PnP adds
the `.pnp.cjs` require itself.

### Actual

```
Error: Cannot find module '<project>/.pnp.cjs <project>/fake-vscode-bootloader.js'
Require stack:
- internal/preload
  code: 'MODULE_NOT_FOUND'
```

### Expected

Both preload modules are required and the dev server starts (as it does with plain
`yarn run dev`, which reaches "Ready").

Minimal proof of the parsing bug alone:

```bash
yarn node -e "process.env.NODE_OPTIONS='--require \"/a/.pnp.cjs\" --require \"/b/bootloader.js\"'; console.log(require('next/dist/server/lib/utils').getFormattedNodeOptionsWithoutInspect())"
# --require="/a/.pnp.cjs /b/bootloader.js"
```

`.vscode/launch.json` reproduces the same crash inside VS Code.
