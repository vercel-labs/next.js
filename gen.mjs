import fs from 'node:fs'
const n = Number(process.argv[2] ?? 100)
const eq = (i) => `## Section ${i}

Inline $E_${i} = mc^2$ and block:

$$
\\int_0^{\\infty} \\frac{x^{${i}}}{e^x-1}dx = \\Gamma(${i}+1)\\zeta(${i}+1) + \\sum_{k=1}^{${i}} \\binom{${i}}{k} \\alpha_k \\beta_{k}^{2}
$$

Some prose paragraph number ${i} with **bold** and \`code\`.
`
let out = '# Heavy math page\n\n'
for (let i = 1; i <= n; i++) out += eq(i) + '\n'
fs.writeFileSync('app/heavy/page.mdx', out)
console.log('sections', n, 'bytes', out.length)
