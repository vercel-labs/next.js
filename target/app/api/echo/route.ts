import { headers } from 'next/headers';
export const dynamic = 'force-dynamic';
export async function GET() {
  const h = await headers();
  return Response.json({
    host: h.get('host'),
    'x-forwarded-host': h.get('x-forwarded-host'),
    forwarded: h.get('forwarded'),
    'x-matched-path': h.get('x-matched-path'),
  });
}
