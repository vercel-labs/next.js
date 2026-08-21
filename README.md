# Reproduction — vercel/next.js#90131

Pages Router i18n: when `i18n.domains` is present, requests on the **default host**
(`localhost`) incorrectly inherit the *domain's* `defaultLocale`, and `next/link`
SSRs absolute `https://<domain>/...` hrefs, causing a hydration mismatch.

`next.config.js` sets `defaultLocale: 'de'` and two domains (`example.fr` → `fr`,
`example.nl` → `nl`). Every domain locale is also served by the default host.

## Run

```bash
npm install
npm run dev          # or: npm run build && npm start
node verify.mjs      # exits 1 while the bug is present
```

Then load http://localhost:3000/fr in a browser and check the console for the
hydration error.

## Observed (next@15.5.12, dev and `next start`)

| path | `router.defaultLocale` | GSSP `defaultLocale` | `NextInternalRequestMeta.defaultLocale` | link hrefs |
|---|---|---|---|---|
| `/`      | `de` | `de` | `de` | relative |
| `/fr`    | **`fr`** | **`fr`** | `de` | **`https://example.fr/…`** |
| `/fr-en` | **`fr`** | **`fr`** | `de` | **`https://example.fr/…`** |
| `/nl`    | **`nl`** | **`nl`** | `de` | **`https://example.nl/…`** |
| `/it`    | `de` | `de` | `de` | relative |

`/it` is not in any `domains` entry, so it stays correct. The request meta always
holds the correct `de`, but it is not used.

## Expected (next@15.3.9)

`defaultLocale` is `de` for every path and all `next/link` hrefs stay relative.
No hydration error.

## Version matrix (verified)

| version | `defaultLocale` on `/fr` | absolute link hrefs | hydration error |
|---|---|---|---|
| `15.3.9` | `de` (correct) | no | no |
| `15.5.12` | `fr` (**bug**) | **yes** | **yes** |
| `16.3.1-canary.26` | `de` (fixed) | **yes (still broken)** | **yes** |

## Root cause

`RouteModule.prepare()` in `next/dist/server/route-modules/route-module.js` calls:

```js
const domainLocale = detectDomainLocale(i18n?.domains, getHostname(parsedUrl, req.headers), detectedLocale)
```

Passing `detectedLocale` makes the `example.fr` entry match even when the hostname
is `localhost`, so `isLocaleDomain` is set to `true` and (on 15.4/15.5) the
domain's `defaultLocale` wins over `i18n.defaultLocale`.

Client-side `router.js` computes `isLocaleDomain` from the **hostname only**
(`detectDomainLocale(domainLocales, self.location.hostname)` → `false` on
localhost), which is exactly why SSR and CSR disagree and hydration fails.

On canary the `defaultLocale` half is fixed, but `isLocaleDomain` still uses
locale-based matching, so the absolute hrefs and the hydration error remain.
