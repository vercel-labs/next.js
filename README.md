# next#67386 — client-component icon object loses tree shaking with 2+ importers

An `Icon` object of many SVG components is tree-shaken fine when exactly one client
component imports it, but as soon as a second client component imports it the whole
module (all unused icons) ends up in the client bundle.

## Run

```bash
npm install
npm run check            # turbopack
node check.mjs --webpack # webpack
```

`check.mjs` builds twice (one vs. two client importers), prints total client chunk
bytes and whether the never-rendered `ICON_40` path data reached the client.

## Observed (next@16.3.1-canary.25, node 24)

| variant | bundler | client chunk bytes | unused ICON_40 shipped |
| --- | --- | --- | --- |
| one client importer | turbopack | 571,970 | no |
| two client importers | turbopack | 689,840 | **yes** |
| one client importer | webpack | 897,668 | no |
| two client importers | webpack | 1,015,584 | **yes** |

Original report (next 14.2.3, `@next/bundle-analyzer`): `Icon.tsx` parsed size
970 B with one importer vs 171,657 B with two importers — confirmed locally.

## Expected

Unused icon components should be dropped regardless of how many client components
import the module.
