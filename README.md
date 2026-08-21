# Repro: issue #86944 — pre-patch React canary version strings in patched Next.js releases

Verifies both halves of the report:

1. The React version string embedded in `dist/compiled/next-server/app-page.runtime.prod.js`
   is **identical** in the vulnerable and the patched Next.js release (it is the `compiled/react`
   version, which was never bumped), so the string cannot be used to verify the CVE-2025-55182 /
   CVE-2025-66478 fix.
2. The actual React fix (the `hasOwnProperty.call(moduleExports, metadata[2])` guard in
   `requireModule` of `react-server-dom-webpack`) **is** present in the patched release and
   absent in the previous one.

## Run

```sh
sh check.sh 15.5.6 15.5.7 16.0.6 16.0.7 15.2.5 15.2.6
```

## Observed output (npm, Node 24)

```
next@15.5.6  react-version-string='19.2.0-canary-0bdb9206-20250818 ' rsc-fix(vendored)=MISSING rsc-fix(app-page.runtime.prod)=MISSING
next@15.5.7  react-version-string='19.2.0-canary-0bdb9206-20250818 ' rsc-fix(vendored)=present rsc-fix(app-page.runtime.prod)=present
next@16.0.6  react-version-string='19.3.0-canary-52684925-20251110 ' rsc-fix(vendored)=MISSING rsc-fix(app-page.runtime.prod)=MISSING
next@16.0.7  react-version-string='19.3.0-canary-52684925-20251110 ' rsc-fix(vendored)=present rsc-fix(app-page.runtime.prod)=present
next@15.2.5  react-version-string='19.1.0-canary-029e8bd6-20250306 ' rsc-fix(vendored)=MISSING rsc-fix(app-page.runtime.prod)=MISSING
next@15.2.6  react-version-string='19.1.0-canary-029e8bd6-20250306 ' rsc-fix(vendored)=present rsc-fix(app-page.runtime.prod)=present
```

Also reproduces the reporter's original script output (all 7 patched releases report pre-patch canary strings).
