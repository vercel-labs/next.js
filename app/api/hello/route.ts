export async function POST(request: Request) {
  const body = await request.text()
  return Response.json({ ok: true, len: body.length })
}
