# Repro: next.js#59316 — metadata in parallel routes

Original reporter repo (https://github.com/azvyae/next-14-repro-bug) is deleted (404); this is a
minimal re-creation on `next@16.3.1-canary.25`.

## Run
```
npm install
npm run build
npm start
curl -s localhost:3000/parallel      | grep -o '<title>[^<]*</title>'
curl -s localhost:3000/non-parallel  | grep -o '<title>[^<]*</title>'
```

## Structure
- `app/layout.js` — `title: { template: '%s | ROOT-TEMPLATE', default: 'ROOT-DEFAULT' }`
- `app/parallel/{page.js,@alpha/page.js,@zulu/page.js}` — titles `PARALLEL-CHILDREN`, `SLOT-ALPHA`, `SLOT-ZULU`
- `app/non-parallel/page.js` — title `NON-PARALLEL-PAGE`

## Expected vs actual
| route | expected | actual |
| --- | --- | --- |
| `/non-parallel` | `NON-PARALLEL-PAGE \| ROOT-TEMPLATE` | `NON-PARALLEL-PAGE \| ROOT-TEMPLATE` (ok) |
| `/parallel` | `PARALLEL-CHILDREN \| ROOT-TEMPLATE` | `SLOT-ZULU` (last slot alphabetically, root template ignored) |

Renaming `@zulu` to `@aaa` changes the title to `SLOT-ALPHA`, confirming the winner is the
alphabetically-last slot. Same result after client-side `<Link>` navigation and after reload.
