// Generates enough modules that a webpack cache hit is obvious in build timings.
import fs from 'node:fs'
fs.mkdirSync('components', { recursive: true })
let imp = '', use = ''
for (let i = 0; i < 400; i++) {
  fs.writeFileSync(
    `components/C${i}.js`,
    `"use client"\nimport {useState} from "react"\nexport default function C${i}(){const [n,s]=useState(${i});return <div onClick={()=>s(n+1)}>C${i} {n} ${'x'.repeat(200)}</div>}\n`
  )
  imp += `import C${i} from "../components/C${i}"\n`
  use += `<C${i}/>`
}
fs.writeFileSync('app/page.js', imp + `export default function Page(){return <main>${use}</main>}\n`)
