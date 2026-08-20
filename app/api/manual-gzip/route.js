import { gzipSync } from 'node:zlib'
export async function GET() {
  const body = gzipSync(JSON.stringify(Array(5000).fill({ id: 1, name: 'example' })))
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip',
    },
  })
}
