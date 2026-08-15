// Fetches a page and reports duplicate Fizz segment ids in one document.
const target = process.argv[2] ?? 'http://localhost:3000/on-demand-1'
const html = await (await fetch(target)).text()

const ids = Array.from(html.matchAll(/<div hidden id="(S:[0-9a-f]+)">/g), (m) => m[1])
const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]

console.log(target)
console.log(`segments: ${ids.length}`)
console.log(`duplicate ids: ${duplicates.length} [${duplicates.join(', ')}]`)
for (const id of duplicates) {
  const rc = html.includes(`$RC("B:${id.slice(2)}","${id}")`)
  const rs = html.includes(`$RS("${id}","P:${id.slice(2)}")`)
  console.log(`  ${id}: $RC boundary reveal=${rc}, $RS segment resume=${rs}`)
}
if (duplicates.length > 0) {
  console.log('\nBUG REPRODUCED: duplicate segment ids in a single document.')
  process.exitCode = 1
}
