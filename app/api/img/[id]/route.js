import { readFile } from 'node:fs/promises'
import path from 'node:path'

// Serves the same big JPEG under many distinct URLs so each /_next/image
// request is a unique cache key (a MISS) and forces a real sharp transform.
export async function GET() {
  const buf = await readFile(path.join(process.cwd(), 'public', 'big.jpg'))
  return new Response(buf, {
    headers: { 'content-type': 'image/jpeg', 'cache-control': 'no-store' },
  })
}
