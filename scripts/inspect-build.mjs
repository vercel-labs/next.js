import { createRequire } from 'node:module'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const serverDirectory = path.resolve('.next/server')
const marker = 'created-by-null-guard'

async function javascriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const absolute = path.join(directory, entry.name)
      if (entry.isDirectory()) return javascriptFiles(absolute)
      return entry.name.endsWith('.js') ? [absolute] : []
    }),
  )
  return nested.flat()
}

const matches = []
for (const file of await javascriptFiles(serverDirectory)) {
  const output = await readFile(file, 'utf8')
  const index = output.indexOf(marker)
  if (index !== -1) {
    matches.push({
      file: path.relative(process.cwd(), file),
      snippet: output.slice(Math.max(0, index - 500), Math.min(output.length, index + marker.length + 500)),
    })
  }
}

console.log(`Next version: ${require('next/package.json').version}`)
if (matches.length === 0) {
  console.error(`FAIL: emitted server JavaScript does not contain ${JSON.stringify(marker)}.`)
  process.exitCode = 1
} else {
  console.log(`PASS: protected creation branch remains in ${matches.length} emitted server file(s).`)
  for (const { file, snippet } of matches) {
    console.log(`\n--- ${file} ---\n${snippet}\n--- end snippet ---`)
  }
}
