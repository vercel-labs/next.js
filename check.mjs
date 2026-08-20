// Hits /api/draft on a running server and prints the __prerender_bypass Set-Cookie.
const url = process.argv[2] || 'http://localhost:3000/api/draft'
const res = await fetch(url, { redirect: 'manual' })
const cookies = res.headers.getSetCookie?.() ?? [res.headers.get('set-cookie')]
console.log(url, res.status)
for (const c of cookies) console.log('set-cookie:', c)
