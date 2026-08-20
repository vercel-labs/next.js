export const runtime = 'edge';

export async function POST(request) {
  const t0 = Date.now();
  const form = await request.formData();
  const file = form.get('file');
  return Response.json({ ok: true, ms: Date.now() - t0, size: file && file.size });
}
