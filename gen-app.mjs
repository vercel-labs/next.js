// Generates a synthetically "large" app-router codebase, because the reported
// dev-server memory-threshold restarts only show up once many routes/modules
// have been compiled by the dev server.
import fs from 'node:fs/promises'
import path from 'node:path'

const routes = Number(process.env.ROUTES ?? 120)
const componentsPerRoute = Number(process.env.COMPONENTS ?? 25)
const root = new URL('./app/gen/', import.meta.url)

await fs.rm(root, { recursive: true, force: true })

for (let r = 0; r < routes; r++) {
  const dir = path.join(root.pathname, `route-${r}`)
  await fs.mkdir(dir, { recursive: true })
  const imports = []
  const usages = []
  for (let c = 0; c < componentsPerRoute; c++) {
    const name = `Comp${c}`
    await fs.writeFile(
      path.join(dir, `comp-${c}.jsx`),
      `export default function ${name}({ n }) {\n` +
        `  const rows = Array.from({ length: 20 }, (_, i) => (\n` +
        `    <li key={i}>route ${r} comp ${c} row {i} {n} ${'x'.repeat(200)}</li>\n` +
        `  ))\n` +
        `  return <ul>{rows}</ul>\n` +
        `}\n`
    )
    imports.push(`import ${name} from './comp-${c}'`)
    usages.push(`<${name} n={now} />`)
  }
  await fs.writeFile(
    path.join(dir, 'page.jsx'),
    `import { connection } from 'next/server'\n` +
      imports.join('\n') +
      `\n\nexport default async function Page() {\n` +
      `  await connection()\n` +
      `  const now = Date.now()\n` +
      `  return <main>${usages.join('')}</main>\n` +
      `}\n`
  )
}

console.log(
  `generated ${routes} routes x ${componentsPerRoute} components = ${
    routes * componentsPerRoute + routes
  } modules`
)
