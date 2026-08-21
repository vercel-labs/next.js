# Reproduction: vercel/next.js#79550

`create-next-app` refuses to scaffold into a directory that contains only a `.github`
directory, because `.github` is missing from the `validFilesOrFolders` allow list in
`packages/create-next-app/helpers/is-folder-empty.ts` (`.vscode`, `.idea`, `.cursor`,
`.claude`, `.git*` etc. are allowed).

## Run

```bash
./repro.sh
```

## Actual

```
The directory myapp contains files that could conflict:

  .github/

Either try using a new directory name, or remove the files listed above.
exit code: 1
```

Reproduced with `create-next-app@15.3.2` and `create-next-app@canary` (16.3.1-canary.26), Node 24.17.0.

## Expected

`.github` is treated as non-conflicting (like `.vscode`/`.idea`) and scaffolding proceeds.
