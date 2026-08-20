export async function POST(req) {
  const body = await req.text().catch(() => '')
  return Response.json({ ok: true, len: body.length })
}
