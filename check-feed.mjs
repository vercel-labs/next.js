// Reproduction for https://github.com/vercel/next.js/issues/92748
// The nextjs.org RSS feed items contain only a one-sentence <description>
// and no <content:encoded> full article body.
const res = await fetch('https://nextjs.org/feed.xml')
const xml = await res.text()
const items = xml.split('<item>').slice(1)
const descs = items.map((i) => (i.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || [, ''])[1])
console.log('HTTP status:', res.status)
console.log('items:', items.length)
console.log('items with <content:encoded>:', items.filter((i) => i.includes('content:encoded')).length)
console.log('items with <content:encoded> namespace declared but unused:', xml.includes('xmlns:content'))
console.log('description length: min', Math.min(...descs.map((d) => d.length)), 'max', Math.max(...descs.map((d) => d.length)))
console.log('first item description:\n', descs[0])
