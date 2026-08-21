export const SOMETHING = { foo: 'bar' } as const

export async function GET() {
  return Response.json({ ok: true, SOMETHING })
}
