import { headers } from 'next/headers';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export async function GET() {
  const h = headers();
  return Response.json({ route: 'j', sessionId: h.get('x-session-id'), ua: h.get('user-agent'), override: h.get('x-middleware-override-headers') });
}
