/* global jest, describe, it, expect */
// Regression test for https://github.com/vercel/next.js/issues/42437
//
// Codemods must only rewrite the code they actually change. Because the
// transforms call `toSource()` without a `lineTerminator`, recast falls back to
// `os.EOL`, so every line ending of a modified file gets normalized to the host
// platform's line ending: LF -> CRLF on Windows (the reported symptom) and
// CRLF -> LF on Linux/macOS.
jest.autoMockOff()

const { applyTransform } = require('jscodeshift/dist/testUtils')
const newLinkTransform = require('../new-link')

const LINES = [
  "import Link from 'next/link'",
  '',
  'export default function Page() {',
  '  return (',
  '    <Link href="/about">',
  '      <a>About</a>',
  '    </Link>',
  '  )',
  '}',
  '',
]

const countCRLF = (source) => (source.match(/\r\n/g) || []).length
const countLoneLF = (source) => (source.match(/(?<!\r)\n/g) || []).length

function transform(source) {
  const output = applyTransform(newLinkTransform, null, {
    path: 'pages/index.js',
    source,
  })
  // Sanity check: the transform actually rewrote the file, otherwise the
  // line ending assertions below would be vacuous.
  expect(output).toContain('About')
  expect(output).not.toContain('<a>')
  return output
}

describe('codemods preserve line endings', () => {
  it('keeps CRLF line endings in a CRLF file', () => {
    const source = LINES.join('\r\n')
    const output = transform(source)

    expect(countLoneLF(output)).toBe(0)
    expect(countCRLF(output)).toBeGreaterThan(0)
  })

  it('keeps LF line endings in an LF file', () => {
    const source = LINES.join('\n')
    const output = transform(source)

    expect(countCRLF(output)).toBe(0)
    expect(countLoneLF(output)).toBeGreaterThan(0)
  })
})
