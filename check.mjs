// Builds the app twice (one client importer vs. two) and reports how much of the
// unused icon payload survives tree shaking in the client bundles.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, statSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const bundler = process.argv.includes('--webpack') ? '--webpack' : '--turbopack'
const page = 'app/page.tsx'
const original = readFileSync(page, 'utf8')

const variants = {
  'one client importer': original.replace('<ClientComponent2 />', ''),
  'two client importers': original,
}

const clientDir = '.next/static/chunks'
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  )

try {
  for (const [label, source] of Object.entries(variants)) {
    writeFileSync(page, source)
    rmSync('.next', { recursive: true, force: true })
    execFileSync('node', ['generate-icons.mjs'], { stdio: 'inherit' })
    execFileSync('npx', ['next', 'build', bundler], { stdio: 'inherit' })

    const files = walk(clientDir).filter((f) => f.endsWith('.js'))
    const total = files.reduce((n, f) => n + statSync(f).size, 0)
    // ICON_40 is never rendered; its path data must not reach the client.
    const marker = 'l39.00 0.390'
    const leaked = files.filter((f) => readFileSync(f, 'utf8').includes(marker))
    console.log(
      `\n== ${label} (${bundler}) ==\n  client chunk bytes: ${total}\n  unused ICON_40 present: ${
        leaked.length > 0
      } ${leaked.join(' ')}\n`
    )
  }
} finally {
  writeFileSync(page, original)
}
