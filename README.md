# Repro: webpack dev server ignores all file changes when the project lives under a `.git*` directory

Upstream issue: https://github.com/vercel/next.js/issues/75372

## Steps

```bash
mkdir -p /tmp/.git-projects && cd /tmp/.git-projects
git clone --branch repro/issue-75372 --single-branch https://github.com/vercel-labs/next.js.git app
cd app
npm install
npm run repro
```

`repro.mjs` starts `next dev --webpack`, requests `/`, edits `app/page.js`
(`VERSION_ONE` -> `VERSION_TWO`), waits, then requests `/` again.

- Inside `/tmp/.git-projects/app` -> `FAIL: file change ignored (bug reproduced)`
- Copy the same folder to e.g. `/tmp/projects/app` and rerun -> `PASS`
- `BUNDLER=turbopack npm run repro` inside the `.git-projects` path -> `PASS`

## Cause

`baseWatchOptions.ignored` in `packages/next/src/build/webpack-config.ts`:

```js
/^((?:[^/]*(?:\/|$))*)(\.(git|next)|node_modules)(\/((?:[^/]*(?:\/|$))*)(?:$|\/))?/
```

The trailing separator group is optional and nothing anchors the end of the path
segment, so any segment merely *starting* with `.git` / `.next` matches
(`.git-projects`, `.github`, `.nextjs-stuff`, ...) and the entire project tree is
excluded from webpack's watcher.
