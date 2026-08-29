# Reproduction for vercel/next.js#98071

`FATAL: An unexpected Turbopack error occurred. TurbopackInternalError: invalid type: null, expected a string`
(`evaluate_webpack_loader failed`) during `next build`.

## Root cause (minimal, no vanilla-extract / React Compiler needed)

When a webpack loader running through Turbopack's webpack-loader bridge throws,
the JS side serializes the error with `stacktrace-parser`. That parser returns
`{ file: null }` for **native** stack frames (`at forEach (native:1:11)`).
The Rust side deserializes frames into
`StackFrame { file: Cow<'a, str> }` (`turbopack/crates/turbopack-node/src/source_map/trace.rs`),
which is **not** optional, so deserialization fails with
`invalid type: null, expected a string` and the real loader error is replaced by
a fatal Turbopack panic.

V8/Node prints `at Array.forEach (<anonymous>)` (parsed fine), but JSC/**bun**
prints `at forEach (native:1:11)`. The issue reporter used a `bun` runner, which
is why the same tree built fine for others and why a plain minimal npm app did
not reproduce.

## Run

```bash
npm install

# broken: loader worker runs under bun -> native frames -> FATAL panic
bun --bun run build

# baseline: loader worker runs under node -> the loader error is reported normally
npm run build
```

`bun --bun run build` (next 16.2.12):

```
FATAL: An unexpected Turbopack error occurred.
Error [TurbopackInternalError]: invalid type: null, expected a string
Debug info:
- Execution of get_all_written_entrypoints_with_issues_operation failed
- Execution of PlainIssue::from_issue failed
- Execution of PlainSource::from_source failed
- Execution of <WebpackLoadersProcessedAsset as Asset>::content failed
- Execution of WebpackLoadersProcessedAsset::process failed
- Execution of evaluate_webpack_loader failed
- invalid type: null, expected a string
```

`npm run build` (next 16.2.12) instead prints the actual cause:

```
./app/data.thing.js
Error evaluating Node.js code
Error: loader failed on purpose
    [at throwsInsideNativeFrame (broken-loader.cjs:7:11)]
```

On next 16.3.3 the panic is downgraded to a build error, but the loader error is
still swallowed: `Reading source code for parsing failed ... invalid type: null,
expected a string ... evaluate_webpack_loader failed`.

Tested with next 16.2.12 and 16.3.3, node 24.17, bun 1.4.0.
