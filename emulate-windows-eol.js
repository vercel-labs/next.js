// Emulates the Windows behavior of issue #42437 on any OS.
// The next-codemod transforms let recast/jscodeshift default `lineTerminator`
// to os.EOL, so every reprinted file gets the *platform* EOL instead of the
// file's own EOL. Forcing os.EOL to '\r\n' reproduces the Windows report.
const os = require('os')
Object.defineProperty(os, 'EOL', { value: '\r\n', configurable: true })

const fs = require('fs')
const path = require('path')
const jscodeshift = require('jscodeshift')
const transform = require('@next/codemod/transforms/new-link.js').default

// restore pristine fixtures (recast only reprints files the transform changes)
require('child_process').execSync('git checkout -- pages', { cwd: __dirname })

const file = path.join(__dirname, 'pages', 'lf.js')
const source = fs.readFileSync(file, 'utf8')
const j = jscodeshift.withParser('tsx')
const out = transform({ path: file, source }, { jscodeshift: j, j, stats: () => {}, report: () => {} }, {})

const count = (s, re) => (s.match(re) || []).length
console.log('os.EOL         :', JSON.stringify(os.EOL))
console.log('input  CRLF/LF :', count(source, /\r\n/g), '/', count(source, /(?<!\r)\n/g))
console.log('output CRLF/LF :', count(out, /\r\n/g), '/', count(out, /(?<!\r)\n/g))
fs.writeFileSync(path.join(__dirname, 'pages', 'lf.out.js'), out)
