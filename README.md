# Repro: missing `sass-embedded` peer dependency support (vercel/next.js#70020)

Only `sass-embedded` is installed (no `sass`). `sass-embedded@1.83.0` is pinned on
purpose: `sass-embedded@>=1.9x` pulls in `sass-embedded-*-all-unknown`, which depends on
`sass` and therefore hides this issue.

## A. default config (no `sassOptions.implementation`)

```bash
pnpm install
pnpm dev      # or: pnpm dev:webpack, pnpm build
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Server log (Turbopack dev and `next build`, Next 16.3.1-canary.24):

```
⨯ ./app/globals.scss
Error: Error evaluating Node.js code
To use Next.js' built-in Sass support, you first need to install `sass`.
Run `npm i sass` or `yarn add sass` inside your workspace.
```

The message never mentions `sass-embedded`, and `next`'s `peerDependencies` /
`peerDependenciesMeta` still only list `sass`.

## B. Yarn PnP (reporter's original error)

```bash
rm -rf node_modules .npmrc
printf 'nodeLinker: pnp\n' > .yarnrc.yml
corepack yarn install
corepack yarn next dev --webpack
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

```
Error: next tried to access sass (a peer dependency) but it isn't provided by your
application; this makes the require call ambiguous and unsound.

Required package: sass
Required by: next@virtual:...#npm:16.3.1-canary.25
  (via .../node_modules/next/dist/compiled/sass-loader/)
Ancestor breaking the chain: next-70020-sass-embedded-repro@workspace:.
```

## Workaround

Uncomment `sassOptions: { implementation: 'sass-embedded' }` in `next.config.mjs`;
Turbopack, webpack and Yarn PnP then all compile `.scss` successfully.
