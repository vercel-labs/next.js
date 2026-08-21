import fs from 'node:fs'
import path from 'node:path'

const root = new URL('..', import.meta.url).pathname
const app = path.join(root, 'app')
fs.rmSync(app, { recursive: true, force: true })
fs.mkdirSync(app, { recursive: true })

fs.writeFileSync(
  path.join(app, 'layout.tsx'),
  `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}\n`
)
fs.writeFileSync(
  path.join(app, 'page.tsx'),
  `export default function Page() {
  return <p>home v0</p>
}\n`
)
// root not-found so the 404 path is a real compiled route (as in the report)
fs.writeFileSync(
  path.join(app, 'not-found.tsx'),
  `export default function NotFound() {
  return <p>not found</p>
}\n`
)

// A large-ish app with many routes and many *dynamic metadata* files.
// Dynamic metadata files are the ones that make setup-dev-bundler await
// (getPageStaticInfo) inside the loop that repopulates fsChecker.appFiles.
const ROUTES = Number(process.env.ROUTES ?? 200)
const ICONS = Number(process.env.ICONS ?? 250)

for (let i = 0; i < ROUTES; i++) {
  const dir = path.join(app, `route-${String(i).padStart(3, '0')}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dir + '/page.tsx', `export default function P() { return <p>r${i}</p> }\n`)
}
for (let i = 0; i < ICONS; i++) {
  // "a-..." sorts before "page.tsx"/"route-*" so the awaits happen while
  // appFiles is still empty/incomplete.
  const dir = path.join(app, `a-icon-${String(i).padStart(3, '0')}`)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(dir + '/page.tsx', `export default function P() { return <p>i${i}</p> }\n`)
  fs.writeFileSync(
    dir + '/icon.tsx',
    `import { ImageResponse } from 'next/og'
export const size = { width: 32, height: 32 }
export default function Icon() {
  return new ImageResponse(<div style={{ display: 'flex' }}>${i}</div>, size)
}\n`
  )
}
console.log('generated', ROUTES, 'routes and', ICONS, 'dynamic icon metadata files')
