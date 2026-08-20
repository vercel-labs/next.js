# Repro attempt for vercel/next.js#56780

Issue claim: `create-next-app` errors when answering the "customize import alias"
prompt with `@/app/*`.

Result: **not reproduced** with `create-next-app@16.3.1` (Next.js 16.3.1) or with the
`create-next-app@13.5.4` that was current when the issue was filed.

## How to run

Fully non-interactive check:

    npx --yes create-next-app@latest myapp --ts --tailwind --eslint --app --src-dir \
      --use-npm --skip-install --import-alias "@/app/*"

Fully interactive check (drives the real prompts through a PTY, answers
"No, customize settings" and types `@/app/*` at the alias prompt):

    python3 run-interactive-cna.py

Then verify the generated app builds and that alias imports resolve:

    cd aliasapp8 && mkdir -p lib && echo 'export const hello = "alias-import-works"' > lib/hello.ts
    # add `import { hello } from "@/app/lib/hello"` to app/page.tsx and log it
    npx next dev --port 3111   # GET / -> 200, "alias-import-works" logged

## Observations

* `cna-interactive-transcript.log` shows the alias prompt accepting `@/app/*`
  (`✔ What import alias would you like configured? … @/app/*`) and the project being
  created successfully.
* Generated `tsconfig.json` contains `"paths": { "@/app/*": ["./*"] }`, i.e. the alias
  maps to the project root, not to `app/`. Imports such as `@/app/lib/hello` resolve.
* `dev-server.log` shows Next.js 16.3.1 ready and `GET / 200`.
* In `create-next-app@16.x` the prompts are skipped entirely whenever any `--flag` is
  passed, so the alias prompt is only reachable with zero flags.
