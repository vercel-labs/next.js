// Generates a synthetic large App Router app to stress Turbopack's
// "whole app module graph" phase.
//   ROUTES  = number of app router page routes
//   PERPAGE = leaf modules created per route (unique to that route)
//   SHARED  = shared modules in a common dependency layer
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'

const ROUTES = Number(process.env.ROUTES ?? 200)
const PERPAGE = Number(process.env.PERPAGE ?? 8)
const SHARED = Number(process.env.SHARED ?? 200)

rmSync('app', { recursive: true, force: true })
rmSync('src', { recursive: true, force: true })
mkdirSync('app', { recursive: true })
mkdirSync('src/shared', { recursive: true })
mkdirSync('src/leaf', { recursive: true })

writeFileSync('app/layout.tsx', `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>)
}\n`)
writeFileSync('app/page.tsx', `export default function Home() { return <div>home</div> }\n`)

for (let s = 0; s < SHARED; s++) {
  const deps = [ (s + 1) % SHARED, (s + 7) % SHARED, (s + 31) % SHARED ].filter((d) => d > s)
  writeFileSync(`src/shared/s${s}.ts`,
    deps.map((d) => `import { v as v${d} } from './s${d}'`).join('\n') +
    `\nexport const v = ${s} ${deps.map((d) => `+ v${d}`).join(' ')}\n` +
    `export function fn${s}(x: number) { return x * v }\n`)
}

let leafId = 0
for (let r = 0; r < ROUTES; r++) {
  const dir = `app/r${r}`
  mkdirSync(dir, { recursive: true })
  const leaves = []
  for (let p = 0; p < PERPAGE; p++) {
    const id = leafId++
    leaves.push(id)
    const sh = [id % SHARED, (id * 13) % SHARED, (id * 29) % SHARED]
    writeFileSync(`src/leaf/l${id}.ts`,
      sh.map((s, i) => `import { fn${s} as f${i} } from '../shared/s${s}'`).join('\n') +
      `\nexport const leaf${id} = f0(1) + f1(2) + f2(3)\n`)
  }
  writeFileSync(`${dir}/page.tsx`,
    leaves.map((id) => `import { leaf${id} } from '../../src/leaf/l${id}'`).join('\n') +
    `\nexport default function Page() { return <div>{${leaves.map((id) => `leaf${id}`).join(' + ')}}</div> }\n`)
}

writeFileSync('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], allowJs: true, skipLibCheck: true,
    strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler',
    resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', incremental: true,
    plugins: [{ name: 'next' }]
  }, include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'], exclude: ['node_modules']
}, null, 2) + '\n')

writeFileSync('next.config.ts', `import type { NextConfig } from 'next'
const nextConfig: NextConfig = { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true } }
export default nextConfig\n`)

console.log(`generated ${ROUTES} routes, ${leafId} leaf modules, ${SHARED} shared modules`)
