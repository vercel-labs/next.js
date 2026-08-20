# Repro: `npm run test` (`jest --watch`) fails in `with-jest` example without git

Issue: https://github.com/vercel/next.js/issues/69236

The `with-jest` / `with-jest-app` example ships `"test": "jest --watch"`.
`jest --watch` requires a git (or hg) repository, so the example fails out of
the box whenever the project is created without version control, e.g.

```bash
pnpm create next-app --example with-jest with-jest-app --disable-git
cd with-jest-app
npm test
# --watch is not supported without git/hg, please use --watchAll
```

## Minimal reproduction (no Next.js needed, same failing flag)

```bash
npm install
npm test    # jest --watch -> exits 1 outside a git repo
```

Expected: tests run (as with `jest`, `jest --ci` or `jest --watchAll`).
Actual: exit code 1 with `--watch is not supported without git/hg, please use --watchAll`
(older jest/CI shells surface it as `Test suite failed to run / thrown: [Error]`).

Verify the fix hypothesis:

```bash
npm run test:ci   # passes
git init && git add -A && git commit -m init && npm test  # watch mode now starts
```
