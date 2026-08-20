// Downloads the `latin` woff2 of a few Google Fonts twice:
//   1. with the User-Agent that next/font/google hardcodes (macOS Chrome 104)
//      https://github.com/vercel/next.js/blob/canary/packages/font/src/google/fetch-resource.ts
//   2. with a Windows Chrome User-Agent (what a plain <link rel=stylesheet> sends on Windows)
// and reports whether the returned font contains TrueType hinting tables.
import fs from 'node:fs/promises'

const NEXT_FONT_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
const WINDOWS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'

const FONTS = [
  ['lato', 'Lato:wght@400'],
  ['ubuntu', 'Ubuntu:wght@400'],
  ['open-sans', 'Open+Sans:wght@300..800'],
]

// Minimal woff2 table-directory reader (spec: https://www.w3.org/TR/WOFF2/#table_dir_format)
const KNOWN_TAGS = ['cmap','head','hhea','hmtx','maxp','name','OS/2','post','cvt ','fpgm','glyf','loca','prep','CFF ','VORG','EBDT','EBLC','gasp','hdmx','kern','LTSH','PCLT','VDMX','vhea','vmtx','BASE','GDEF','GPOS','GSUB','EBSC','JSTF','MATH','CBDT','CBLC','COLR','CPAL','SVG ','sbix','acnt','avar','bdat','bloc','bsln','cvar','fdsc','feat','fmtx','fvar','gvar','hsty','just','lcar','mort','morx','opbd','prop','trak','Zapf','Silf','Glat','Gloc','Feat','Sill']

function tablesOf(buf) {
  let o = 0
  const u16 = () => { const v = buf.readUInt16BE(o); o += 2; return v }
  const u32 = () => { const v = buf.readUInt32BE(o); o += 4; return v }
  const base128 = () => { let v = 0; for (;;) { const b = buf[o++]; v = (v << 7) | (b & 0x7f); if (!(b & 0x80)) return v } }
  const sig = buf.toString('ascii', 0, 4)
  if (sig !== 'wOF2') throw new Error('not a woff2 file: ' + sig)
  o = 12
  const numTables = (o = 12, u16())
  o = 48
  const tags = []
  for (let i = 0; i < numTables; i++) {
    const flags = buf[o++]
    const idx = flags & 0x3f
    let tag
    if (idx === 0x3f) { tag = buf.toString('ascii', o, o + 4); o += 4 } else { tag = KNOWN_TAGS[idx] }
    base128() // origLength
    const transform = flags >> 6
    const transformed = tag === 'glyf' || tag === 'loca' ? transform === 0 : transform !== 0
    if (transformed) base128() // transformLength
    tags.push(tag)
  }
  return tags
}

async function grab(query, ua) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${query}&display=swap`
  const css = await (await fetch(cssUrl, { headers: { 'user-agent': ua } })).text()
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map((m) => m[1])
  const url = urls.at(-1) // last block is the `latin` subset
  const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': ua } })).arrayBuffer())
  return { url, buf }
}

const HINTING = ['prep', 'fpgm', 'cvt ']
for (const [name, query] of FONTS) {
  for (const [label, ua] of [['nextfont-ua', NEXT_FONT_UA], ['windows-ua', WINDOWS_UA]]) {
    const { url, buf } = await grab(query, ua)
    await fs.writeFile(new URL(`../public/${name}-${label}.woff2`, import.meta.url), buf)
    const tags = tablesOf(buf)
    const hint = HINTING.filter((t) => tags.includes(t))
    console.log(
      `${name.padEnd(10)} ${label.padEnd(12)} ${String(buf.length).padStart(6)} bytes  hinting=${
        hint.length ? hint.join(',') : 'NONE'
      }  ${url.split('/').pop()}`
    )
  }
}
