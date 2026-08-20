export const dynamic = 'force-dynamic';

export async function POST(request) {
  const t0 = Date.now();
  const body = await request.json();
  return Response.json({ ok: true, ms: Date.now() - t0, length: JSON.stringify(body).length });
}
