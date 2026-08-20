import * as http from 'http'

export const dynamic = 'force-dynamic'

export async function GET() {
  const body = await new Promise((resolve, reject) => {
    http
      .get('http://localhost:3000/check', (res) => {
        let data = ''
        res.on('data', (c) => (data += c))
        res.on('end', () => resolve(data))
      })
      .on('error', reject)
  })
  const parsed = JSON.parse(body)
  const hasTraceparent = Object.keys(parsed.headers).includes('traceparent')
  console.log('[repro] traceparent propagated to /check?', hasTraceparent)
  return Response.json({ hasTraceparent, headers: parsed.headers })
}
