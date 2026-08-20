# Reproduction: `EMFILE: too many open files` during `next build` (#64093)

Issue: https://github.com/vercel/next.js/issues/64093

The reporters hit `Error: EMFILE: too many open files` while running `next build`
(on Windows/macOS, various Next 13/14/15 versions). No reproduction was attached to
the issue. This repo reproduces the crash deterministically by running a build under a
low per-process file-descriptor limit, which is exactly the condition users hit when
other processes on the machine have consumed the OS fd budget (which is why a reboot
"fixes" it).

App: App Router, 61 trivial static pages, no user code that opens files.

## Run

```bash
npm install
bash repro.sh
```

or just the failing case:

```bash
rm -rf .next
bash -c 'ulimit -n 96; npx next build --webpack'
```

## Observed (next@canary 16.3.1-canary.25, Node 24.17.0, Linux)

Webpack builder, `ulimit -n 96`: compilation succeeds, then the static-generation
phase crashes with an unhandled rejection and exit code 1:

```
  Generating static pages using 1 worker (0/63) ...
Error: EMFILE: too many open files, open '.next/server/app/p/58/page.js'
    at ignore-listed frames {
  errno: -24, code: 'EMFILE', syscall: 'open', path: '.../.next/server/app/p/58/page.js'
}
unhandledRejection Error: EMFILE: too many open files, ...
EXIT=1
```

There is no retry/backoff or graceful-fs style queueing around these reads, and the
error surfaces as an `unhandledRejection` rather than a build error with guidance.

Turbopack builder (default) survives the same app even at `ulimit -n 64` (`EXIT=0`),
so the fd exhaustion is specific to the webpack/JS build + static generation path.
