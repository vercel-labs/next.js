export const dynamic = 'force-dynamic';

export async function POST(request) {
  const t0 = Date.now();
  console.log('[upload] start', request.headers.get('content-type'), request.headers.get('content-length'));
  const form = await request.formData();
  const file = form.get('file');
  const size = file && typeof file.size === 'number' ? file.size : null;
  console.log('[upload] formData resolved in', Date.now() - t0, 'ms size=', size);
  return Response.json({ ok: true, ms: Date.now() - t0, size, name: file && file.name });
}
