import fs from 'fs'
import path from 'path'

export async function GET() {
  // Delay so the blur placeholder stays visible long enough to screenshot.
  await new Promise((r) => setTimeout(r, 8000))
  const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'photo.png'))
  return new Response(buf, {
    headers: { 'content-type': 'image/png', 'cache-control': 'no-store' },
  })
}
