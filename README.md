# Repro: next.js#78509 — Turbopack fails with "Permission denied (os error 13)" on an unreadable directory

A directory in the project root that the dev-server user cannot read (e.g. `docker-data/postgres`
created by a Docker postgres container running as another uid, common on CI) makes Turbopack's
wildcard-resolution directory walk (`resolve_reference_from_dir` -> `read_matches` -> `raw_read_dir`)
fail hard, aborting compilation of the `instrumentation` entry instead of skipping the directory.

`@sentry/nextjs` is only the trigger: its `withSentryConfig.js` contains a dynamic `require`, so
Turbopack enumerates the whole project directory tree.

## Steps

```bash
npm install
mkdir -p docker-data/postgres
sudo chown root:root docker-data/postgres && sudo chmod 000 docker-data/postgres  # unreadable by you
npm run dev
```

Must be run as a *non-root* user (root ignores the permission bits).

## Actual (next 15.3.1)

```
 ○ Compiling instrumentation Node.js ...
[Error [TurbopackInternalError]: [project]/node_modules/@sentry/nextjs/build/cjs/config/withSentryConfig.js [instrumentation] (ecmascript)

Caused by:
- reading dir <project>/docker-data/postgres
- Permission denied (os error 13)
...
- Execution of resolve_reference_from_dir failed
- Execution of read_matches failed
- Execution of <DiskFileSystem as FileSystem>::raw_read_dir failed
```

## Expected

Unreadable directories are skipped (with at most a warning); dev server compiles.

## Notes

- Reproduced on next@15.3.1 with `--turbopack`.
- Not reproduced on next@16.3.1-canary.26 with the same app: dev server boots, instrumentation
  compiles, `GET / 200`.
