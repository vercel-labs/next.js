import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

// Mirrors the reporter's dynamic route handler that invalidates the cache.
export async function POST(_req, { params }) {
  const { accountid } = await params;
  revalidateTag(`rated:${accountid}`);
  console.log('[REVALIDATE] rated:' + accountid);
  return Response.json({ ok: true });
}
