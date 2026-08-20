// Fetches the SSR HTML and prints which images got a <link rel="preload" as="image">.
const base = process.argv[2] || 'http://localhost:3000'
for (const path of ['/', '/pages-router']) {
  const html = await (await fetch(base + path)).text()
  const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/g)].map((m) => m[0])
  const seeds = new Set(
    preloads.flatMap((l) => [...l.matchAll(/seed(?:%2F|\/)([a-z]+)/g)].map((m) => m[1]))
  )
  console.log(`${path} -> preloaded images: ${[...seeds].join(', ') || '(none)'}`)
}
console.log('\nExpected: only "priority". Actual: "eager" and "plain" are preloaded too (bug).')
