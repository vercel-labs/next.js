export const dynamic = 'force-dynamic'

export async function GET() {
  // simulate a route handler doing a few dozen async round-trips
  for (let i = 0; i < 50; i++) {
    await Promise.resolve(i)
  }
  return Response.json({ ok: true, t: Date.now() })
}
