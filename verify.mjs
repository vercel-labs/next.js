// Extracts every path-like string that a crawler doing naive text matching
// would find inside the inlined __NEXT_DATA__ script of a rendered page.
const base = process.env.BASE_URL || 'http://localhost:3000'
const urls = ['/', '/the-post-slug']

for (const u of urls) {
  const html = await (await fetch(base + u)).text()
  const m = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  )
  console.log('\n=== ' + u + ' ===')
  if (!m) {
    console.log('no __NEXT_DATA__ script found')
    continue
  }
  console.log('__NEXT_DATA__:', m[1])
  const paths = [...new Set(m[1].match(/"\/[^"]*"/g) || [])]
  console.log('path-like strings a crawler can scrape:', paths.join(', '))
}
