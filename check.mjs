const base = process.env.BASE || 'http://localhost:3001'
const buildId = process.env.BUILD_ID || 'development'
const url = `${base}/library/_next/data/${buildId}/index.json`
const res = await fetch(url, { redirect: 'manual' })
console.log('GET', url)
console.log('status:', res.status)
console.log('location:', res.headers.get('location'))
console.log('content-type:', res.headers.get('content-type'))
console.log('body:', (await res.text()).slice(0, 200))
