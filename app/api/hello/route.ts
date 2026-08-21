export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    // present only when the function actually runs on the Bun runtime
    isBun: typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined',
    now: Date.now(),
  })
}
