import { cookies } from 'next/headers';
export async function GET() {
  const c = await cookies();
  const v = `${Date.now()}`;
  c.set('session', v, { path: '/', domain: '.example1.com' });
  c.set('session', v, { path: '/', domain: '.example2.com' });
  return Response.json({ ok: true });
}
