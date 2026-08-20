// Fetches http://localhost:3000 and reports whether the initial HTML
// contains <link rel="preload" as="font"> tags for next/font assets.
const url = process.argv[2] ?? 'http://localhost:3000'
const html = await (await fetch(url)).text()
const links = [...html.matchAll(/<link[^>]*>/g)].map((m) => m[0])
const fonts = links.filter((l) => l.includes('as="font"'))
console.log(`url: ${url}`)
console.log(`link tags in initial HTML:\n${links.join('\n')}`)
console.log(`\nfont preload tags: ${fonts.length}`)
process.exit(fonts.length ? 0 : 1)
