export const dynamic = 'force-dynamic'
let counter = 0
export async function GET() {
  counter++
  console.log(`[origin] /api/time hit #${counter}`)
  return Response.json({ counter, now: new Date().toISOString() })
}
