// Usage: node verify.mjs [baseUrl]   (default http://localhost:3000)
const base = process.argv[2] || 'http://localhost:3000'
const rows = []
for (const p of ['/', '/fr', '/fr-en', '/nl', '/nl-en', '/it']) {
  const html = await (await fetch(base + p)).text()
  const d = JSON.parse(
    html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)[1]
  )
  rows.push({
    path: p,
    locale: d.locale,
    defaultLocale: d.defaultLocale,
    gsspDefaultLocale: d.props.pageProps.defaultLocale,
    metaDefaultLocale: d.props.pageProps.metaDefaultLocale,
    absoluteLinkHrefs: [...html.matchAll(/href="(https?:[^"]*)"/g)].map((m) => m[1]),
  })
}
console.table(rows.map((r) => ({ ...r, absoluteLinkHrefs: r.absoluteLinkHrefs.length })))
console.log(JSON.stringify(rows, null, 2))

const bad = rows.filter((r) => r.defaultLocale !== 'de' || r.absoluteLinkHrefs.length > 0)
if (bad.length) {
  console.error(`\nBUG: ${bad.length} path(s) on the default host resolved a domain defaultLocale and/or emitted absolute hrefs.`)
  process.exit(1)
}
console.log('\nOK: every path kept defaultLocale "de" and emitted only relative hrefs.')
