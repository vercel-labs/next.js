import { mkdirSync, writeFileSync, existsSync } from 'node:fs'

const ROUTES = Number(process.env.ROUTES ?? 120)
const DIRS = Number(process.env.DATA_DIRS ?? 40)
const FILES = Number(process.env.DATA_FILES ?? 500)

for (let i = 0; i < ROUTES; i++) {
  const dir = `app/api/r${i}`
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    `${dir}/route.js`,
    "export const dynamic = 'force-dynamic'\nexport async function GET() {\n  return new Response(String(Math.random()))\n}\n"
  )
}

for (let d = 0; d < DIRS; d++) {
  const dir = `data/d${d}`
  mkdirSync(dir, { recursive: true })
  for (let f = 0; f < FILES; f++) {
    const p = `${dir}/f${f}.txt`
    if (!existsSync(p)) writeFileSync(p, 'x')
  }
}

console.log(`generated ${ROUTES} routes and ${DIRS * FILES} traced files`)
