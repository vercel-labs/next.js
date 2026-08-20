// Fetches the page and prints the srcset candidate widths.
const url = process.env.URL || 'http://localhost:3000/'
const html = await (await fetch(url)).text()
const m = html.match(/srcset="([^"]+)"/i) || html.match(/srcSet="([^"]+)"/)
if (!m) {
  console.error('no srcset found')
  process.exit(1)
}
const srcset = m[1].replace(/&amp;/g, '&')
const widths = [...srcset.matchAll(/(\d+)w/g)].map((x) => Number(x[1]))
console.log('sizes attr:', (html.match(/sizes="([^"]+)"/) || [])[1])
console.log('srcset candidates:', widths.join(', '))
console.log('max candidate:', Math.max(...widths))
console.log('unreachable (> 280px * 3 = 840w):', widths.filter((w) => w > 840).join(', ') || 'none')
