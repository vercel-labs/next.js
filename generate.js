// Generates the CSS-heavy app used by test.sh (60 global CSS files, 60 CSS
// modules, 60 components, 6 routes). Keeps the repro repo small.
const fs = require('fs')
const N = 60
fs.rmSync('app', { recursive: true, force: true })
fs.rmSync('styles', { recursive: true, force: true })
fs.mkdirSync('styles', { recursive: true })
fs.mkdirSync('app/components', { recursive: true })
for (let i = 1; i <= N; i++) {
  fs.writeFileSync(`styles/global${i}.css`, `.g${i} { color: rgb(${i % 256},${i % 256},${i % 256}); padding: ${i}px }\n`)
  fs.writeFileSync(`app/components/mod${i}.module.css`, `.m${i} { color: rgb(${i % 256},0,0); font-size:${i}px }\n.m${i}b { margin:${i}px }\n`)
  fs.writeFileSync(`app/components/Comp${i}.js`, `import s from './mod${i}.module.css'\nexport default function Comp${i}() { return <div className={s['m${i}']}>c${i}</div> }\n`)
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k)
const globals = range(1, N).map((i) => `import '../styles/global${i}.css'`).join('\n')
const layoutComps = range(1, N / 2)
fs.writeFileSync(
  'app/layout.js',
  `${globals}\n${layoutComps.map((i) => `import Comp${i} from './components/Comp${i}'`).join('\n')}\n\nexport default function RootLayout({ children }) {\n  return (<html lang="en"><body>${layoutComps.map((i) => `<Comp${i} />`).join('')}{children}</body></html>)\n}\n`
)
const pageComps = range(N / 2 + 1, N)
fs.writeFileSync(
  'app/page.js',
  `${pageComps.map((i) => `import Comp${i} from './components/Comp${i}'`).join('\n')}\n\nexport default function Page() { return <main><h1>hello</h1>${pageComps.map((i) => `<Comp${i} />`).join('')}</main> }\n`
)
for (let p = 1; p <= 5; p++) {
  fs.mkdirSync(`app/p${p}`, { recursive: true })
  const c = range(1, N).filter((i) => i % 5 === p % 5)
  fs.writeFileSync(
    `app/p${p}/page.js`,
    `${c.map((i) => `import Comp${i} from '../components/Comp${i}'`).join('\n')}\nimport '../../styles/global${p}.css'\n\nexport default function P${p}() { return <div>${c.map((i) => `<Comp${i} />`).join('')}</div> }\n`
  )
}
console.log('generated app/ and styles/')
