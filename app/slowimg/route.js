import fs from 'fs'
import path from 'path'
export const dynamic = 'force-dynamic'
export async function GET() {
  await new Promise((r) => setTimeout(r, 1500))
  const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'box.png'))
  return new Response(buf, {
    headers: { 'content-type': 'image/png', 'cache-control': 'no-store' },
  })
}
