const fs = require('fs'), path = require('path')
const acorn = require('acorn')
const dir = '.next/static/chunks'
const files = []
;(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); e.isDirectory()?walk(p):p.endsWith('.js')&&files.push(p)}})(dir)
let bad = 0
for (const f of files) {
  const src = fs.readFileSync(f,'utf8')
  const lits = src.match(/(?:0[xX][0-9a-fA-F]+|\d+)n(?![\w$])/g)
  try {
    acorn.parse(src, {ecmaVersion: 2019, sourceType: 'script'}) // ES2019 = Safari 12/13 level, no BigInt
    if (lits) console.log(`${f}: has BigInt literals ${[...new Set(lits)].join(',')} but parsed as ES2019?`)
  } catch (e) {
    bad++
    const i = e.pos || 0
    console.log(`FAIL ${f}\n  acorn(ecmaVersion:2019) SyntaxError: ${e.message}`)
    console.log(`  BigInt literals found: ${lits ? [...new Set(lits)].join(', ') : 'none'}`)
    console.log(`  context: ...${src.slice(Math.max(0,i-90), i+90).replace(/\n/g,' ')}...`)
    const m = src.match(/buffer[^"']{0,40}/)
    console.log(`  contains 'Buffer' identifier: ${src.includes('Buffer')}`)
  }
}
console.log(`\nscanned ${files.length} client chunks, ${bad} fail to parse at ES2019 (Safari <14) level`)
