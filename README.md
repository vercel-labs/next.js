# Repro: vercel/next.js#83429 — "Filename too long" when cloning next.js on Windows

`git clone https://github.com/vercel/next.js.git` aborts individual files with

```
error: unable to create file crates/next-custom-transforms/.../support-export-named-as-default-with-a-class/output-data.js: Filename too long
fatal: unable to checkout working tree
```

## Why

The repository tracks paths up to **209 characters** long (canary), mostly
turbopack snapshot outputs such as
`turbopack/crates/turbopack-tests/tests/snapshot/cjs-remove-unused-exports/define-property-getter-reads-export/output/1ngs_js-remove-unused-exports_define-property-getter-reads-export_input_index_20zrr4b.js.map`
and `crates/next-custom-transforms/tests/fixture/strip-page-exports/...` fixtures.

Git for Windows with the default `core.longpaths=false` refuses any *fully
resolved* path longer than `MAX_PATH` (260). So the clone fails as soon as the
clone root is ~60+ characters (e.g. `C:\Users\<user>\OneDrive\Desktop\<folder>\next.js`),
which is what the reporter hit.

## Run

```
python3 repro.py                  # ROOT_LEN=69 -> reproduces (exit 0)
ROOT_LEN=40 python3 repro.py      # short clone root -> clean clone (exit 1, "not reproduced")
REF=<sha> python3 repro.py        # analyse a different commit
```

Requirements: Linux, `gcc`, `git`, `python3`, network access.

* **Part 1** is portable: it lists, for a given clone-root length, every tracked
  path whose full Windows path would exceed 260 chars.
* **Part 2** performs a real `git clone --depth 1` into a clone root of
  `ROOT_LEN` characters with `maxpath260.so` `LD_PRELOAD`ed. The shim makes
  `open`/`openat`/`creat`/`mkdir`/`rename` fail with `ENAMETOOLONG` when the
  resolved path exceeds 260 characters — exactly the limit Git for Windows
  enforces — so git produces the reporter's errors on Linux. (Linux's own
  `PATH_MAX` is 4096 and git checks out with relative paths, so the bug cannot
  otherwise be observed off Windows.)

## Observed (canary, ROOT_LEN=69)

```
paths that cannot be created: 32
git clone exit code: 128
errors containing "Filename too long": 33
error: unable to create file crates/next-custom-transforms/tests/fixture/strip-page-exports/getStaticProps/support-export-named-as-default-with-other-specifiers/support-export-named-as-default-with-a-class/output-data.js: File name too long
error: unable to create file crates/next-custom-transforms/tests/fixture/strip-page-exports/getStaticProps/support-export-named-as-default-with-other-specifiers/support-export-named-as-default-with-a-class/output-default.js: File name too long
error: unable to create file turbopack/crates/turbopack-tests/tests/snapshot/cjs-remove-unused-exports/define-property-getter-reads-export/output/154e_...js
...
fatal: unable to checkout working tree
```

(`File name too long` is glibc's wording for `ENAMETOOLONG`; Git for Windows
prints `Filename too long` for the same errno.)

## Notes / mitigations

* `git clone -c core.longpaths=true` (Git for Windows) or a short clone root such
  as `C:\src\next.js` avoids the failure today; the longest tracked path (209)
  only fits when the root is <= 50 chars.
* A durable fix would shorten the generated turbopack snapshot output filenames
  and the `strip-page-exports` fixture directory names.
