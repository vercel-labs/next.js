# Reproduction: vercel/next.js#98065

`create-next-app` crashes with `TypeError: opts.name is not a function` instead
of printing the usage message when no project directory can be resolved.

## Run

```bash
npm install
npm run repro
```

Requires network access (part 2 downloads `create-next-app@canary` from npm).

## Expected

```
Please specify the project directory:
  create-next-app <project-directory>
```

## Actual

```
Aborting installation.
Unexpected error. Please report it as a bug:
 TypeError: an.name is not a function      # `an` = program.opts() in the bundle
```

## Root cause

`packages/create-next-app/index.ts`:

```ts
const opts = program.opts()
...
if (!projectPath) {
  console.log('\nPlease specify the project directory:\n' +
    `  ${cyan(opts.name())} ${green('<project-directory>')}\n` + ...)
```

`program.opts()` returns a plain object without a `name()` method; only the
`Command` instance has one. Fix: use `program.name()`.

Note: the process also exits with code 0 because `exit()` awaits
`notifyUpdate()`, which calls `process.exit(0)` before `process.exit(1)`.
