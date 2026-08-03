import https from 'node:https'

export const dynamic = 'force-dynamic'

// Server-side outbound HTTP request via node:https (what e.g. the Sanity
// client does under the hood). Not part of any test context.
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => resolve(body.slice(0, 80)))
    })
    req.on('error', reject)
    req.setTimeout(20000, () => req.destroy(new Error('request never settled (20s)')))
  })
}

export default async function Page() {
  const data = await get('https://example.com/')
  return <pre>{data}</pre>
}
