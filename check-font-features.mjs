// Downloads the woff2 files that next/font/google emitted for Inter and prints
// the OpenType features each one exposes, next to the official Inter build.
import fs from 'node:fs'
import * as fontkit from 'fontkit'

const base = process.argv[2] ?? 'http://localhost:3000'
const html = await (await fetch(base)).text()
const cssHrefs = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1])
const urls = new Set()
for (const href of cssHrefs) {
  const cssUrl = new URL(href, base)
  const css = await (await fetch(cssUrl)).text()
  for (const m of css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)) {
    urls.add(new URL(m[1], cssUrl).href)
  }
}
console.log(`found ${urls.size} woff2 file(s) emitted by next/font\n`)
for (const url of urls) {
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer())
  const font = fontkit.create(buf)
  const feats = font.availableFeatures
  console.log(url.replace(base, ''))
  console.log('  postscriptName:', font.postscriptName)
  console.log('  features:', feats.join(' '))
  console.log('  has ss01:', feats.includes('ss01'), '| has zero:', feats.includes('zero'), '| has cv05:', feats.includes('cv05'))
}
const official = fontkit.openSync('./app/InterVariable.woff2')
console.log('\nofficial InterVariable.woff2 (inter-ui):')
console.log('  features:', official.availableFeatures.join(' '))
