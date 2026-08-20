# Issue #35542 — Windows drive-letter capitalization ("Invalid casing detected for project dir")

Reproduction harness for https://github.com/vercel/next.js/issues/35542

The reporter's steps ("install Next 12 on Windows and run `npm run dev`") require a Windows
host, which is not available here. This harness reproduces the exact code path instead, by
executing the **real** `next/dist/lib/get-project-dir.js` of several published Next.js
versions while simulating Windows path/fs semantics:

- `path.resolve` keeps the drive-letter casing the shell gave it (`c:\projects\website`)
- `fs.realpathSync.native` (`GetFinalPathNameByHandle`) returns the canonical `C:\projects\website`
- the JS `fs.realpathSync` keeps the given casing

## Run

```bash
bash run.sh
```

## Result

```
--- next@12.1.1
returned: C:\projects\website
warning:  warn - Invalid casing detected for project dir, received c:\projects\website actual path C:\projects\website, ...
--- next@13.3.0
warning:  warn - Invalid casing detected for project dir, received c:\projects\website actual path C:\projects\website, ...
--- next@14.2.17   warning: (none)
--- next@14.2.18   warning: (none)
--- next@canary    warning: (none)
```

`packages/next/src/lib/realpath.ts` (added in vercel/next.js#48698, released in 13.4) makes
Windows use `fs.realpathSync` instead of `fs.realpathSync.native`, so the drive-letter
mismatch no longer occurs on Windows in current versions.

Part B of `run.sh` boots `next dev` against a project directory reached through a
differently-cased symlink; the warning still prints on canary, i.e. the warning itself is
still live — only the Windows drive-letter trigger is gone.
