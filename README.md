# Repro: vercel/next.js#87686 — "Failed to load external module styled-components-<hash>"

The reporter's repo (`Aluisio/test-styled-components`) is not public, so this is a minimal
reproduction. Pages Router app + `styled-components` in `_document`, Next `16.1.1`, Turbopack.

## Run

```bash
./repro.sh
```

## What happens

`next build` (16.1.1) now emits a symlink for each server-external package:

```
.next/node_modules/styled-components-bd377d8093d58039 -> ../../node_modules/styled-components
```

If `.next` is transferred to the runtime host in a way that does not preserve symlinks
(FTP/GUI upload, `docker COPY` of selected dirs, artifact copy), every request 500s with:

```
Error: Failed to load external module styled-components-bd377d8093d58039:
Error: Cannot find module 'styled-components-bd377d8093d58039'
```

even though `styled-components` is installed in `node_modules` on the host.

- Next `16.0.10`: `next build` produces **no** `.next/node_modules`, so a symlink-less copy works.
- Next `16.1.1`: fails (HTTP 500) unless the symlink survives the copy. A copy that
  dereferences symlinks (`cp -rL`, `tar -h`, `zip -y`) works.
